import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, colorScheme:"light" });
const p = await c.newPage();
await p.goto("http://localhost:8080/", { waitUntil:"load", timeout:45000 });
await new Promise(r=>setTimeout(r,4500)); // let hero device cycle
await p.screenshot({ path:"/tmp/shots/m-hero.png" }); // viewport top
// scroll to testimonials
await p.evaluate(async()=>{ for(let y=0;y<6000;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));} });
await p.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(n=>/jonathan|stacey|clients say/i.test(n.textContent||'') && n.children.length<3); if(el) el.scrollIntoView({block:'center'}); });
await new Promise(r=>setTimeout(r,800));
await p.screenshot({ path:"/tmp/shots/m-testimonials.png" });
console.log("ok"); await b.close();
