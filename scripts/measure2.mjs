import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1, isMobile:true });
const p = await c.newPage();
await p.goto("http://localhost:8080/reportly",{waitUntil:"load",timeout:45000});
const tops = await p.evaluate(()=>{ const s=[...document.querySelectorAll('section')].find(el=>el.offsetHeight>window.innerHeight*3); return s?s.offsetTop:0; });
await p.evaluate(({tops})=>window.scrollTo(0, tops + window.innerHeight*4*0.45), {tops});
await new Promise(r=>setTimeout(r,1100));
const out = await p.evaluate(()=>{
  const inView = el => { const r=el.getBoundingClientRect(); return r.width>40 && r.height>40 && r.top<window.innerHeight && r.bottom>0; };
  // visible iPad screen = dark bg, ~180px wide, on screen
  const screens=[...document.querySelectorAll('div')].filter(d=>{const s=getComputedStyle(d); return (s.backgroundColor==='rgb(10, 10, 15)'||/#0a0a0f/.test(d.className)) && inView(d); });
  const ipad = screens.sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0];
  const r=el=>el?(b=>({top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height),w:Math.round(b.width)}))(el.getBoundingClientRect()):null;
  // its framed parent (border)
  const frame = ipad ? ipad.closest('div[class*="border"]') : null;
  const desc=[...document.querySelectorAll('h3')].filter(inView)[0];
  return { vh:window.innerHeight, ipadScreen:r(ipad), frame:r(frame), firstVisibleTitle: desc?desc.textContent.slice(0,20):null, titleRect:r(desc) };
});
console.log(JSON.stringify(out));
await b.close();
