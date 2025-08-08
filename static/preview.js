(function(){
  if (typeof docId === "undefined") return;

  const chatForm = document.getElementById("chatForm");
  const chatLog = document.getElementById("chatLog");
  const chatInput = document.getElementById("chatInput");
  const lengthMode = document.getElementById("lengthMode");
  const customWords = document.getElementById("customWords");
  const includeInContext = document.getElementById("includeInContext");
  const stripExisting = document.getElementById("stripExisting");
  const stateForm = document.getElementById("stateForm");
  const pdfFrame = document.getElementById("pdfFrame");

  // length mode toggle
  function updateCustomVisibility(){
    if (lengthMode && customWords){
      customWords.style.display = lengthMode.value === "custom" ? "inline-block" : "none";
    }
  }
  if (lengthMode){
    lengthMode.addEventListener("change", updateCustomVisibility);
    updateCustomVisibility();
  }

  function appendMsg(role, content){
    if (!chatLog) return;
    const wrap = document.createElement("div");
    wrap.className = "chat-msg " + (role === "user" ? "user" : "assistant");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = content;
    wrap.appendChild(bubble);
    chatLog.appendChild(wrap);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function refreshPDF(){
    if (!pdfFrame) return;
    const base = pdfFrame.src.split("?")[0];
    pdfFrame.src = base + "?_ts=" + Date.now();
  }

  async function postForm(url, data){
    const res = await fetch(url, { method: "POST", body: data });
    let j = null;
    try{ j = await res.json(); }catch(e){}
    if (!res.ok){
      const err = (j && j.error) ? j.error : ("HTTP " + res.status);
      throw new Error(err);
    }
    return j || {};
  }

  // Chat submit
  if (chatForm){
    chatForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const msg = (chatInput.value || "").trim();
      if (!msg) return;
      appendMsg("user", msg);

      const fd = new FormData();
      fd.append("message", msg);
      fd.append("length_mode", lengthMode ? lengthMode.value : "standard");
      if (customWords && customWords.value && lengthMode && lengthMode.value === "custom"){
        fd.append("custom_words", customWords.value);
      }

      chatInput.value = "";
      try{
        const resp = await postForm(`/reportly/chat/${docId}`, fd);
        if (resp.assistant_message){
          appendMsg("assistant", resp.assistant_message);
        }else{
          appendMsg("assistant", "Updated the document content.");
        }
        refreshPDF();
      }catch(err){
        appendMsg("assistant", "⚠︎ " + err.message);
      }
    });
  }

  // State toggles
  async function pushState(){
    if (!stateForm) return;
    const fd = new FormData();
    fd.append("include_in_context", includeInContext && includeInContext.checked ? "1" : "0");
    fd.append("strip_existing", stripExisting && stripExisting.checked ? "1" : "0");
    try{
      await postForm(`/reportly/state/${docId}`, fd);
      refreshPDF();
    }catch(e){
      // non-blocking
      console.warn("state update failed", e);
    }
  }
  if (includeInContext) includeInContext.addEventListener("change", pushState);
  if (stripExisting) stripExisting.addEventListener("change", pushState);

  // Default: focus chat input
  if (chatInput) chatInput.focus();
})();
