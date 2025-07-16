// Utility: escape HTML
function escapeHTML(s) {
    return s.replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;");
  }
  
  document.getElementById('processBtn').addEventListener('click', async () => {
    const rawText = document.getElementById('problemInput').value.trim();
    if (!rawText) return alert('Please paste the problem text.');
  
    // Clear previous results
    document.getElementById('parsedOutput').innerHTML = '';
    document.getElementById('calcOutput').innerHTML = '';
    document.getElementById('beamOutput').innerHTML = '';
  
  
    // 1) Send to AI backend
    let resp;
    let data;
    try {
      // Show a loading indicator (optional, but good for UX)
      document.getElementById('parsedOutput').innerHTML = 'Processing...';
      document.getElementById('calcOutput').innerHTML = 'Processing...';
      document.getElementById('beamOutput').innerHTML = 'Processing...';
  
  
      resp = await fetch('/api/process', { // This endpoint needs to be created on the backend
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text: rawText })
      });
  
      if (!resp.ok) {
          const errorText = await resp.text();
          throw new Error(`Backend error: ${resp.status} ${resp.statusText} - ${errorText}`);
      }
  
      data = await resp.json();
  
    } catch (e) {
      document.getElementById('parsedOutput').innerHTML = '<div style="color: red;">Error: ' + escapeHTML(e.message) + '</div>';
      document.getElementById('calcOutput').innerHTML = '';
      document.getElementById('beamOutput').innerHTML = '';
      console.error('Processing error:', e);
      return;
    } finally {
        // Clear loading indicators
        if (document.getElementById('parsedOutput').innerHTML === 'Processing...') document.getElementById('parsedOutput').innerHTML = '';
        if (document.getElementById('calcOutput').innerHTML === 'Processing...') document.getElementById('calcOutput').innerHTML = '';
        if (document.getElementById('beamOutput').innerHTML === 'Processing...') document.getElementById('beamOutput').innerHTML = '';
    }
  
  
    // 2) Render parsed sections
    const parsedDiv = document.getElementById('parsedOutput');
    if (data.sections && data.sections.length > 0) {
        data.sections.forEach(sec => {
          const div = document.createElement('div');
          div.className = 'parsed-section-item'; // Add a class for styling if needed
          div.innerHTML = escapeHTML(sec); // Use innerHTML in case backend sends HTML snippets
          parsedDiv.appendChild(div);
        });
    } else {
        parsedDiv.innerHTML = 'No sections parsed or received.';
    }
  
  
    // 3) Render calculations (LaTeX via MathJax)
    const calcDiv = document.getElementById('calcOutput');
    if (data.calculations && data.calculations.length > 0) {
         calcDiv.innerHTML = data.calculations
          .map(l => `\\(${l}\\)`)
          .join('  \n');  // double-space+newline for markdown linebreak
         // Ensure MathJax is typeset after updating the content
         if (window.MathJax) {
              MathJax.typesetPromise([calcDiv]).catch((err) => console.error('MathJax typesetting failed:', err));
         } else {
              console.warn('MathJax not loaded.'); // Should not happen if script tag is correct
         }
    } else {
        calcDiv.innerHTML = 'No calculations available or received.';
    }
  
  
    // 4) Render beam table
    const beamDiv = document.getElementById('beamOutput');
    if (data.beams && data.beams.length > 0) {
        let html = `<table border="1" cellpadding="6" cellspacing="0"
                      style="width:100%;border-collapse:collapse">
          <thead style="background:#0057a3;color:#fff">
            <tr>
              <th>Section</th><th>Depth</th><th>Wt</th><th>Capacity</th>
            </tr>
          </thead><tbody>`;
        data.beams.forEach(b => {
          html += `<tr${b.recommended?' style="font-weight:bold; background-color: #e0f7fa;"':''}> {# Highlight recommended #}
            <td>${escapeHTML(b.section)}</td>
            <td>${escapeHTML(String(b.depth))}</td> {# Ensure data is treated as string for display #}
            <td>${escapeHTML(String(b.wt))}</td>
            <td>${escapeHTML(String(b.capacity))}</td>
          </tr>`;
        });
        html += `</tbody></table>`;
        beamDiv.innerHTML = html;
    } else {
        beamDiv.innerHTML = 'No beam candidates found or received.';
    }
  });