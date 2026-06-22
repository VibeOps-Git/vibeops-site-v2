import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true });
const p = await c.newPage();
await p.goto("http://localhost:8080/reportly",{waitUntil:"load",timeout:45000});
const tops = await p.evaluate(()=>{ const s=[...document.querySelectorAll('section')].find(el=>el.offsetHeight>window.innerHeight*3); return s?s.offsetTop:0; });
await p.evaluate(({tops})=>window.scrollTo(0, tops + window.innerHeight*4*0.45), {tops});
await new Promise(r=>setTimeout(r,1000));
const data = await p.evaluate(()=>{
  const vh = window.innerHeight;
  const fixed = [...document.querySelectorAll('div')].find(d=>{ const s=getComputedStyle(d); return s.position==='fixed' && d.offsetHeight>vh*0.8 && /Add Project|Quality Control|Import Template|Building Code|Generate|Export|Reportly/.test(d.textContent||''); });
  const r = (el)=> el ? (b=>({top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height)}))(el.getBoundingClientRect()) : null;
  // find ipad screen, the step title, and how-it-works
  const ipad = [...document.querySelectorAll('div')].find(d=>/w-\[178px\]|w-\[150px\]|w-\[180px\]/.test(d.className) || (getComputedStyle(d).aspectRatio==='' && d.querySelector('[class*="aspect"]')));
  const title = [...document.querySelectorAll('h3')].find(h=>/Project|Quality|Template|Code|Generate|Export|Reportly/.test(h.textContent||''));
  const how = [...document.querySelectorAll('*')].find(n=>/How it works/.test(n.textContent||'') && n.children.length<3);
  return { vh, fixed:r(fixed), title:r(title), how:r(how) };
});
console.log(JSON.stringify(data,null,1));
await b.close();
