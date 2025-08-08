# reportly.py
from flask import request, render_template, redirect, url_for, flash, send_file, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path
from docx import Document
from openai import OpenAI
import uuid, json, os, requests, re, logging, time, random

# =====================================================================================
# LOGGING
# =====================================================================================
logger = logging.getLogger("vibeops.reportly")
if not logger.handlers:
    h = logging.StreamHandler()
    h.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s %(name)s: %(message)s"))
    logger.addHandler(h)
logger.setLevel(logging.INFO)

# =====================================================================================
# OPENAI — mimic your working generator: ONLY API key from env, model hardcoded
# =====================================================================================
OPENAI_MODEL = "gpt-3.5-turbo"
OPENAI_API_KEY = os.environ.get("OpenAI_API_KEY")

_client = None
def _get_openai_client():
    """Singleton OpenAI client using only env key (no custom base_url)."""
    global _client
    if _client is None:
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client

# =====================================================================================
# Directories & Preview Conversion
# =====================================================================================
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
STATE_DIR  = Path("state")
for d in (UPLOAD_DIR, OUTPUT_DIR, STATE_DIR):
    d.mkdir(parents=True, exist_ok=True)

# Prefer Gotenberg for DOCX->PDF if provided, else local LibreOffice
GOTENBERG_URL = os.environ.get("GOTENBERG_URL")  # e.g. http://gotenberg:3000

# =====================================================================================
# Helpers (files/state)
# =====================================================================================
def allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower() == ".docx"

def save_state(doc_id: str, data: dict):
    (STATE_DIR / f"{doc_id}.json").write_text(json.dumps(data, indent=2))

def load_state(doc_id: str):
    f = STATE_DIR / f"{doc_id}.json"
    return json.loads(f.read_text()) if f.exists() else None

# =====================================================================================
# Helpers (text/structure)
# =====================================================================================
def _normalize_ws(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()

def _any_blocks_populated(structure: list) -> bool:
    for s in structure or []:
        if s.get("blocks"):
            return True
    return False


def extract_template_structure(doc: Document):
    """
    Extract ordered document structure (H1/H2/H3) from the uploaded DOCX.
    Returns: [{ id, title, level, style_name, blocks: [] }, ...]
    """
    sections = []
    for p in doc.paragraphs:
        style = (p.style.name if p.style else "") or ""
        style_lower = style.lower()
        text = _normalize_ws(p.text)
        if not text:
            continue
        level = None
        if "heading 1" in style_lower:
            level = 1
        elif "heading 2" in style_lower:
            level = 2
        elif "heading 3" in style_lower:
            level = 3

        if level:
            sections.append({
                "id": str(uuid.uuid4()),
                "title": text,
                "level": level,
                "style_name": style,
                "blocks": []
            })

    # Fallback if no headings detected
    if not sections:
        for title in ["Executive Summary", "Scope", "Findings", "Risks", "Recommendations"]:
            sections.append({
                "id": str(uuid.uuid4()),
                "title": title,
                "level": 1,
                "style_name": "Heading 1",
                "blocks": []
            })
    return sections

def doc_to_fast_html(doc: Document):
    """Lightweight structural HTML (for optional outline view)."""
    parts = []
    for p in doc.paragraphs:
        style = (p.style.name if p.style else "").lower()
        text = _normalize_ws(p.text)
        if not text:
            continue
        if "heading 1" in style:
            parts.append(f"<h1>{text}</h1>")
        elif "heading 2" in style:
            parts.append(f"<h2>{text}</h2>")
        elif "heading 3" in style:
            parts.append(f"<h3>{text}</h3>")
        else:
            parts.append(f"<p>{text}</p>")
    return "\n".join(parts)

def clear_document_body(doc: Document):
    """
    Remove body paragraphs/tables while preserving sections, headers, footers, styles.
    This keeps all original formatting (margins, headers/footers, styles) intact.
    """
    body = doc._element.body
    for child in list(body):
        body.remove(child)

def compose_from_structure(template_path: Path, structure: list, outfile: Path, strip_existing=True):
    """
    Write a new DOCX by mapping the structured blocks into the template's styles.
    Keeps template formatting, headers/footers, and style set.
    """
    doc = Document(str(template_path))
    if strip_existing:
        clear_document_body(doc)

    for si, sec in enumerate(structure):
        title = sec.get("title", "")
        level = int(sec.get("level", 1))
        style_name = "Heading 1" if level == 1 else "Heading 2" if level == 2 else "Heading 3"
        if title:
            ph = doc.add_paragraph(title)
            try:
                ph.style = doc.styles[style_name]
            except KeyError:
                pass  # fall back to whatever default exists

        for block in sec.get("blocks", []):
            btype = block.get("type")
            if btype == "paragraph":
                text = _normalize_ws(block.get("text", ""))
                if text:
                    p = doc.add_paragraph(text)
                    try:
                        p.style = doc.styles["Normal"]
                    except KeyError:
                        pass

            elif btype == "list":
                items = block.get("items", [])
                style = block.get("style", "bullet")  # bullet|number
                for idx, it in enumerate(items):
                    txt = _normalize_ws(it)
                    if not txt:
                        continue
                    if style == "number":
                        p = doc.add_paragraph(f"{idx+1}. {txt}")
                    else:
                        p = doc.add_paragraph(txt)
                    try:
                        p.style = doc.styles.get("List Paragraph", doc.styles["Normal"])
                    except KeyError:
                        pass

            elif btype == "table":
                headers = block.get("headers", [])
                rows = block.get("rows", [])
                cols = len(headers) if headers else (len(rows[0]) if rows else 0)
                if cols > 0:
                    t = doc.add_table(rows=1 if headers else 0, cols=cols)
                    if headers:
                        hdr_cells = t.rows[0].cells
                        for i, h in enumerate(headers[:cols]):
                            hdr_cells[i].text = _normalize_ws(h)
                    for r in rows:
                        row_cells = t.add_row().cells
                        for i, cell_val in enumerate(r[:cols]):
                            row_cells[i].text = _normalize_ws(cell_val)

        if si < len(structure) - 1:
            doc.add_paragraph("")  # spacing between sections

    doc.save(str(outfile))

# =====================================================================================
# DOCX → PDF (Exact Preview)
# =====================================================================================
def _docx_to_pdf_local(docx_path: Path, out_pdf: Path):
    import subprocess, shlex
    out_pdf.parent.mkdir(parents=True, exist_ok=True)
    out_dir = out_pdf.parent
    cmd = (
        f'soffice --headless --convert-to pdf --outdir {shlex.quote(str(out_dir))} '
        f'{shlex.quote(str(docx_path))}'
    )
    proc = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode('utf-8', 'ignore') or proc.stdout.decode('utf-8', 'ignore'))
    produced = docx_path.with_suffix(".pdf").name
    produced_path = out_dir / produced
    if produced_path != out_pdf:
        if out_pdf.exists():
            out_pdf.unlink()
        produced_path.rename(out_pdf)
    return out_pdf

def docx_to_pdf(docx_path: Path, out_pdf: Path):
    if GOTENBERG_URL:
        with open(docx_path, "rb") as f:
            files = {
                "files": ("document.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            }
            r = requests.post(f"{GOTENBERG_URL}/forms/libreoffice/convert", files=files, timeout=120)
            r.raise_for_status()
            out_pdf.parent.mkdir(parents=True, exist_ok=True)
            out_pdf.write_bytes(r.content)
            return out_pdf
    return _docx_to_pdf_local(docx_path, out_pdf)

def build_preview_pdf(doc_id: str) -> Path:
    state = load_state(doc_id)
    if not state:
        raise FileNotFoundError("No state for preview")

    # If we don't have any generated content yet, preview the ORIGINAL uploaded doc
    # so all original body, headers/footers, and styles appear pixel-true.
    if not _any_blocks_populated(state.get("structure")):
        src = Path(state["upload_path"])
        preview_pdf = OUTPUT_DIR / f"{doc_id}_preview.pdf"
        return docx_to_pdf(src, preview_pdf)

    # Otherwise compose from the structure into the template and preview that
    preview_docx = OUTPUT_DIR / f"{doc_id}_preview.docx"
    compose_from_structure(
        template_path=Path(state["upload_path"]),
        structure=state["structure"],
        outfile=preview_docx,
        strip_existing=state.get("strip_existing", True)
    )
    preview_pdf = OUTPUT_DIR / f"{doc_id}_preview.pdf"
    return docx_to_pdf(preview_docx, preview_pdf)


# =====================================================================================
# JSON coercion — robust parsing of weird model output
# =====================================================================================
def _strip_code_fences(s: str) -> str:
    s = s.strip()
    m = re.search(r"^```(?:json)?\s*([\s\S]*?)\s*```$", s, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return s

def _extract_balanced_json(s: str):
    """
    Find the first top-level balanced JSON object or array in a string.
    Handles chatter before/after, nested braces, and strings.
    """
    start_idx = None
    stack = []
    in_str = False
    esc = False

    for i, ch in enumerate(s):
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == '"':
                in_str = False
            continue
        else:
            if ch == '"':
                in_str = True
                continue
            if ch in ['{', '[']:
                if start_idx is None:
                    start_idx = i
                stack.append(ch)
            elif ch in ['}', ']']:
                if not stack:
                    continue
                opener = stack.pop()
                if (opener, ch) not in [('{' , '}'), ('[', ']')]:
                    start_idx = None
                    stack.clear()
                    continue
                if not stack and start_idx is not None:
                    return s[start_idx:i+1]
    return None

def _coerce_json(text: str) -> dict:
    text = (text or "").strip()
    # 1) direct
    try:
        return json.loads(text)
    except Exception:
        pass
    # 2) strip code fences
    try:
        jf = _strip_code_fences(text)
        return json.loads(jf)
    except Exception:
        pass
    # 3) balanced extraction
    blk = _extract_balanced_json(text)
    if blk:
        return json.loads(blk)
    raise ValueError("Model did not return valid JSON.")

# =====================================================================================
# LLM Prompting
# =====================================================================================
LLM_SYSTEM_PROMPT = """You generate regulated enterprise report content.

Return ONLY a single JSON object that matches this schema EXACTLY. Do not wrap the answer in code fences. Do not add commentary, prefixes, or suffixes.

{
  "sections": [
    {
      "id": "string (echo the provided id)",
      "title": "string (echo the provided title unless explicitly instructed to rename)",
      "level": 1|2|3,
      "blocks": [
        { "type": "paragraph", "text": "plain text, no markdown" } |
        { "type": "list", "style": "bullet"|"number", "items": ["..."] } |
        { "type": "table", "headers": ["..."], "rows": [["..."]]}
      ]
    }
  ]
}

Rules:
- Respect the given section order and levels.
- If target_section_ids is empty or missing, populate ALL sections. Otherwise, only populate the provided target sections and leave others unchanged.
- Do NOT include markdown, HTML, code fences, or style tags in text.
- Stay within the requested length mode (concise/standard/detailed/custom words).
- Keep tables <= 8 columns. Avoid empty blocks.
- Output MUST be valid JSON that parses with json.loads()."""

def _length_hint(length_mode: str, custom_words: int | None) -> dict:
    """
    Provide rough guidance for per-section word counts. The model won't obey perfectly,
    but nudging helps consistency.
    """
    length_mode = (length_mode or "standard").lower()
    if length_mode == "concise":
        return {"per_section_words": 80}
    if length_mode == "detailed":
        return {"per_section_words": 220}
    if length_mode == "custom" and custom_words:
        # distribute roughly across sections; model receives the target for context
        return {"per_section_words": max(50, int(custom_words))}
    return {"per_section_words": 140}  # standard

def build_user_llm_message(prompt_text, structure, include_source_text=False, source_text=None,
                           length_mode="standard", custom_words=None, target_section_ids=None):
    """
    Build the user message with a compact copy of the template structure so the model
    can fill blocks per section. Also passes optional target_section_ids list.
    """
    template_skeleton = [
        {"id": s["id"], "title": s["title"], "level": s["level"]}
        for s in structure
    ]
    length = _length_hint(length_mode, custom_words if isinstance(custom_words, int) else None)
    payload = {
        "instruction": prompt_text,
        "length_mode": length_mode,
        "custom_word_count": custom_words,
        "per_section_word_hint": length["per_section_words"],
        "template_structure": template_skeleton,
        "include_source_text": include_source_text,
        "source_text_excerpt": source_text[:6000] if (include_source_text and source_text) else None,
        "target_section_ids": target_section_ids or []  # empty => ALL sections
    }
    msg = {
        "role": "user",
        "content": json.dumps(payload, ensure_ascii=False)
    }
    # Keep a raw copy for offline stub path:
    msg["template_structure"] = template_skeleton
    msg["target_section_ids"] = target_section_ids or []
    return msg

def extract_source_plaintext(doc: Document, max_chars=15000):
    """Flatten paragraph text for optional AI context (NOT formatting)."""
    texts, size = [], 0
    for p in doc.paragraphs:
        t = _normalize_ws(p.text)
        if t:
            texts.append(t)
            size += len(t) + 1
            if size > max_chars:
                break
    return "\n".join(texts)[:max_chars]

def _retry(delay=0.4, jitter=0.2, times=2):
    """Simple retry decorator with small jitter."""
    def deco(fn):
        def wrapper(*args, **kwargs):
            last = None
            for i in range(times+1):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last = e
                    if i == times:
                        break
                    sleep = delay + random.random()*jitter
                    logger.info(f"Retrying OpenAI call in {sleep:.2f}s due to: {e}")
                    time.sleep(sleep)
            raise last
        return wrapper
    return deco

@_retry()
def _openai_chat(client, messages, timeout, use_response_format=True):
    if use_response_format:
        return client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=3000,
            response_format={"type": "json_object"},
            timeout=timeout,
        )
    else:
        return client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=3000,
            timeout=timeout,
        )

def call_openai_structured(messages, timeout=120):
    """
    Use chat.completions.create with JSON coercion when possible,
    then robustly coerce output into JSON.
    """
    # Offline / no-key fallback — deterministic skeleton fill so UX still works
    if not OPENAI_API_KEY:
        template = messages[-1].get("template_structure", [])
        targets = messages[-1].get("target_section_ids", []) or [s["id"] for s in template]
        allowed = set(targets)
        return {
            "sections": [
                {
                    "id": s.get("id"),
                    "title": s.get("title"),
                    "level": s.get("level"),
                    "blocks": [{"type": "paragraph", "text": f"Placeholder content for {s.get('title')}."}]
                }
                for s in template
                if (not targets) or (s["id"] in allowed)
            ]
        }

    client = _get_openai_client()

    # Ensure string contents
    safe_messages = []
    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if not isinstance(content, str):
            content = json.dumps(content, ensure_ascii=False)
        safe_messages.append({"role": role, "content": content})

    # First try: force JSON
    try:
        resp = _openai_chat(client, safe_messages, timeout, use_response_format=True)
    except Exception as e:
        logger.info(f"Falling back to no response_format: {e}")
        resp = _openai_chat(client, safe_messages, timeout, use_response_format=False)

    content = (resp.choices[0].message.content or "").strip()
    logger.info("OpenAI content snippet: %s", (content[:800].replace("\n", " ") + ("..." if len(content) > 800 else "")))

    return _coerce_json(content)

# =====================================================================================
# Section targeting — generate ALL by default, else only specific sections
# =====================================================================================
_SECTION_KEYWORDS = [
    "executive summary","summary","scope","findings","risk","risks","recommendations",
    "overview","introduction","conclusion","methodology","background","analysis","results"
]

def _match_section_titles(message: str, structure: list) -> list[str]:
    """
    Heuristic: if user says "only/just/update/rewrite X" and X resembles
    a title or common keyword, target those sections. Otherwise, return [] (=> all).
    """
    msg = (message or "").lower()
    # If they explicitly say "all sections", return []
    if re.search(r"\ball\b\s+\bsections?\b", msg):
        return []

    # Only/just/update this section...
    if re.search(r"\b(only|just|update|rewrite|revise|regenerate)\b", msg):
        candidates = set()
        # Direct title matches (fuzzy contains)
        for s in structure:
            t = s.get("title","").lower()
            if not t: 
                continue
            # If any token from message appears in the title, consider it
            tokens = [w for w in re.findall(r"[a-z0-9]+", msg) if len(w) > 2]
            if any(tok in t for tok in tokens):
                candidates.add(s["id"])
        # Keyword matches
        for s in structure:
            t = s.get("title","").lower()
            if any(k in msg for k in _SECTION_KEYWORDS) and any(k in t for k in _SECTION_KEYWORDS):
                candidates.add(s["id"])
        return list(candidates)

    # If they mention a known section explicitly without "only", we still assume ALL unless "only" group is present
    return []

# =====================================================================================
# Route Handlers
# =====================================================================================
def handle_upload():
    file = request.files.get("file")
    if not file or file.filename == "":
        flash("Please choose a .docx file to upload.", "error")
        return render_template("reportly.html", state=None)
    if not allowed_file(file.filename):
        flash("Only .docx files are supported.", "error")
        return render_template("reportly.html", state=None)

    doc_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    up_path = UPLOAD_DIR / f"{doc_id}_{filename}"
    file.save(up_path)

    try:
        doc = Document(str(up_path))
    except Exception as e:
        flash(f"Failed to parse .docx: {e}", "error")
        return render_template("reportly.html", state=None)

    structure  = extract_template_structure(doc)
    fast_html  = doc_to_fast_html(doc)

    state = {
        "doc_id": doc_id,
        "filename": filename,
        "upload_path": str(up_path),
        "strip_existing": False,
        "include_in_context": False,   # checkbox toggle
        "structure": structure,        # LLM-populated blocks will go here
        "messages": [],                # chat log: [{role, content}]
        "html_outline": fast_html,
        "composed_path": None,
        # Debug snapshots of last LLM call
        "last_llm_payload": None,
        "last_llm_raw": None
    }
    save_state(doc_id, state)

    # Build initial preview immediately
    try:
        build_preview_pdf(doc_id)
    except Exception as e:
        flash(f"Preview build warning: {e}", "error")

    return redirect(url_for("reportly_edit", doc_id=doc_id))

def handle_edit(doc_id):
    state = load_state(doc_id)
    if not state:
        flash("Document not found.", "error")
        return redirect(url_for("reportly_home"))
    return render_template("reportly.html", state=state)

def handle_state_update(doc_id):
    """
    POST: update toggles (include_in_context, strip_existing) and refresh preview.
    """
    state = load_state(doc_id)
    if not state:
        return jsonify({"ok": False, "error": "Document not found"}), 404

    if "include_in_context" in request.form:
        state["include_in_context"] = request.form.get("include_in_context") in ("1", "true", "on")
    if "strip_existing" in request.form:
        state["strip_existing"] = request.form.get("strip_existing") in ("1", "true", "on")

    save_state(doc_id, state)

    try:
        build_preview_pdf(doc_id)
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

    return jsonify({"ok": True})

def handle_chat(doc_id):
    """
    POST: { message, length_mode, custom_words }
    Default: populate ALL sections. If the user's message implies "only X",
    we detect target sections heuristically and populate just those.
    """
    state = load_state(doc_id)
    if not state:
        return jsonify({"ok": False, "error": "Document not found"}), 404

    message = (request.form.get("message") or "").strip()
    if not message:
        return jsonify({"ok": False, "error": "Message is required"}), 400
    length_mode  = (request.form.get("length_mode") or "standard").lower()
    custom_words = request.form.get("custom_words")
    try:
        cw = int(custom_words) if (custom_words and custom_words.isdigit()) else None
    except:
        cw = None

    # Determine which sections to target (ALL by default)
    target_ids = _match_section_titles(message, state["structure"])  # [] => all

    # Construct LLM messages (system + history + current user payload)
    llm_messages = [{"role": "system", "content": LLM_SYSTEM_PROMPT}]
    for m in state.get("messages", []):
        llm_messages.append({"role": m["role"], "content": m["content"]})

    include = bool(state.get("include_in_context"))
    source_excerpt = None
    try:
        if include:
            source_excerpt = extract_source_plaintext(Document(state["upload_path"]))
    except Exception:
        source_excerpt = None

    llm_user_msg = build_user_llm_message(
        prompt_text=message,
        structure=state["structure"],
        include_source_text=include,
        source_text=source_excerpt,
        length_mode=length_mode,
        custom_words=cw,
        target_section_ids=target_ids
    )

    # Append user message to state (chat log)
    state["messages"].append({"role": "user", "content": message})
    save_state(doc_id, state)

    try:
        # Store last payload for debugging in UI if needed
        state["last_llm_payload"] = llm_user_msg["content"]
        save_state(doc_id, state)

        # Call LLM
        llm_messages.append(llm_user_msg)
        result = call_openai_structured(llm_messages)

        # Store raw result text in state for logs
        try:
            state["last_llm_raw"] = json.dumps(result, ensure_ascii=False)[:200000]
        except Exception:
            state["last_llm_raw"] = "[[non-serializable result]]"
        save_state(doc_id, state)

        # Merge LLM blocks into our structure by id
        new_sections = result.get("sections", [])
        by_id = {s["id"]: s for s in state["structure"]}
        updated_any = False
        for s in new_sections:
            sid = s.get("id")
            if sid in by_id:
                safe = by_id[sid]
                safe["blocks"] = s.get("blocks", [])
                updated_any = True

        # If model returned empty (rare), at least drop a placeholder in targets or all
        if not updated_any:
            ids = target_ids or [s["id"] for s in state["structure"]]
            for sid in ids:
                if sid in by_id:
                    by_id[sid]["blocks"] = [{"type": "paragraph", "text": "Placeholder content (model returned empty)."}]

        save_state(doc_id, state)

        # Rebuild exact preview
        build_preview_pdf(doc_id)

        # Add assistant confirmation
        scope_msg = "all sections" if not target_ids else "selected sections"
        assistant_msg = f"Updated the document content for {scope_msg}."
        state["messages"].append({"role": "assistant", "content": assistant_msg})
        save_state(doc_id, state)

        return jsonify({"ok": True, "assistant_message": assistant_msg})

    except Exception as e:
        err = f"Generation failed: {e}"
        state["messages"].append({"role": "assistant", "content": err})
        save_state(doc_id, state)
        logger.error(err)
        return jsonify({"ok": False, "error": err}), 500

def handle_compose(doc_id):
    state = load_state(doc_id)
    if not state:
        flash("Document not found.", "error")
        return redirect(url_for("reportly_home"))

    out_path = OUTPUT_DIR / f"{doc_id}_composed.docx"
    compose_from_structure(
        template_path=Path(state["upload_path"]),
        structure=state["structure"],
        outfile=out_path,
        strip_existing=state.get("strip_existing", True)
    )
    state["composed_path"] = str(out_path)
    save_state(doc_id, state)
    flash("Composed document created.", "success")
    return redirect(url_for("reportly_download", doc_id=doc_id))

def handle_download(doc_id):
    state = load_state(doc_id)
    if not state or not state.get("composed_path"):
        flash("No composed document available. Click 'Compose & Download' first.", "error")
        return redirect(url_for("reportly_edit", doc_id=doc_id))
    return send_file(state["composed_path"], as_attachment=True, download_name="report.docx")

def handle_preview(doc_id):
    pdf_path = OUTPUT_DIR / f"{doc_id}_preview.pdf"
    if not pdf_path.exists():
        try:
            pdf_path = build_preview_pdf(doc_id)
        except Exception as e:
            flash(f"Preview failed: {e}", "error")
            state = load_state(doc_id)
            return render_template("reportly.html", state=state or None)
    resp = send_file(str(pdf_path), mimetype="application/pdf")
    resp.headers["Cache-Control"] = "no-store, max-age=0"
    return resp
