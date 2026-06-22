import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ colorScheme:"light", viewport:{width:1440,height:900}});
const p = await c.newPage();
// homepage hero desktop
await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
await new Promise(r=>setTimeout(r,3500));
await p.screenshot({ path:"/tmp/shots/desktop-home.png" });
// reportly showcase desktop
await p.goto("http://localhost:8080/reportly",{waitUntil:"load",timeout:45000});
const tops=await p.evaluate(()=>{const s=[...document.querySelectorAll('section')].find(el=>el.offsetHeight>window.innerHeight*3);return s?s.offsetTop:0;});
await p.evaluate(({tops})=>window.scrollTo(0,tops+window.innerHeight*4*0.45),{tops});
await new Promise(r=>setTimeout(r,1000));
await p.screenshot({ path:"/tmp/shots/desktop-reportly.png" });
console.log("ok"); await b.close();
