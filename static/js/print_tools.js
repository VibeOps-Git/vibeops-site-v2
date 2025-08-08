// static/js/print_tool.js
// Browser-only “.print” collector using File System Access API (Chromium)
// Falls back to directory-upload if not supported.

const DEFAULTS = {
  maxDepth: 2,
  maxBytes: 300_000,
  skipDirs: new Set([".git", "__pycache__", "node_modules"]),
  textExts: new Set([
    ".txt",".md",".markdown",".py",".js",".ts",".tsx",".jsx",".json",
    ".yml",".yaml",".ini",".cfg",".toml",".css",".scss",".sass",
    ".html",".htm",".jinja",".jinja2",".jinja-html",".jinja2-html",
    ".sh",".bat",".ps1",".rb",".php",".java",".c",".cpp",".h",".hpp"
  ])
};

function extOf(name){ const i = name.lastIndexOf("."); return i>=0 ? name.slice(i).toLowerCase() : ""; }

async function looksTextFile(file, sniffBytes=2048){
  try{
    const blob = file.slice(0, sniffBytes);
    const buf  = await blob.arrayBuffer();
    // quick check for null bytes
    const view = new Uint8Array(buf);
    for (let i=0;i<view.length;i++){ if(view[i]===0) return false; }
    // try UTF-8 decode
    new TextDecoder("utf-8", {fatal:false}).decode(view);
    return true;
  }catch{ return false; }
}

async function readFileLimited(file, maxBytes){
  const blob = file.slice(0, maxBytes);
  const text = await blob.text();
  return text;
}

async function walkDirectory(handle, options, depth=0, relPath=""){
  const {
    maxDepth, maxBytes, skipDirs, textExts
  } = options;

  let treeLines = [];
  let contentsParts = [];

  // guard
  if (!handle || handle.kind !== "directory") return { tree:"", contents:"" };

  for await (const [name, entry] of handle.entries()){
    const path = relPath ? `${relPath}/${name}` : name;

    if (entry.kind === "directory"){
      if (skipDirs.has(name)) continue;
      treeLines.push(`📁 ${path}/`);
      if (depth < maxDepth){
        const child = await walkDirectory(entry, options, depth+1, path);
        treeLines.push(child.tree);
        contentsParts.push(child.contents);
      }
    } else if (entry.kind === "file"){
      treeLines.push(`📄 ${path}`);
      try{
        const file = await entry.getFile();
        if (file.size > maxBytes) continue;

        const ext = extOf(name);
        const isTexty = textExts.has(ext) || await looksTextFile(file);
        if (!isTexty) continue;

        const txt = await readFileLimited(file, maxBytes);
        contentsParts.push(`\n--- Contents of ${path} ---\n${txt}`);
      }catch(_e){ /* ignore unreadable */ }
    }
  }

  return {
    tree: treeLines.filter(Boolean).join("\n"),
    contents: contentsParts.filter(Boolean).join("\n")
  };
}

export async function runPrintCollector(opts={}){
  const options = { ...DEFAULTS, ...opts };
  if (window.showDirectoryPicker){
    const dir = await window.showDirectoryPicker({ mode:"read" });
    return await walkDirectory(dir, options);
  }
  // Fallback: prompt user with a directory file input (Safari/Firefox)
  return new Promise((resolve, reject)=>{
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.webkitdirectory = true; // works on Safari
    input.addEventListener("change", async ()=>{
      const files = Array.from(input.files || []);
      if (!files.length) return reject(new Error("No files selected."));
      const byPath = {};
      files.forEach(f => {
        // Try to get a relative path; Safari uses webkitRelativePath
        const rel = f.webkitRelativePath || f.name;
        byPath[rel] = f;
      });

      const lines = [];
      const contents = [];

      // Build a naïve tree by sorting paths
      const paths = Object.keys(byPath).sort();
      for (const p of paths){
        const isDir = p.endsWith("/");
        if (isDir) { lines.push(`📁 ${p}`); continue; }
        lines.push(`📄 ${p}`);

        const file = byPath[p];
        if (file.size > options.maxBytes) continue;
        const ext = extOf(file.name);
        const isTexty = options.textExts.has(ext) || await looksTextFile(file);
        if (!isTexty) continue;

        const txt = await readFileLimited(file, options.maxBytes);
        contents.push(`\n--- Contents of ${p} ---\n${txt}`);
      }

      resolve({ tree: lines.join("\n"), contents: contents.join("\n") });
    }, { once:true });
    input.click();
  });
}
