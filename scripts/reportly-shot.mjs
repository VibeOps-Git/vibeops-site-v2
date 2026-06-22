import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ colorScheme:"light", viewport:{width:1366,height:900}});
const p = await c.newPage();
await p.goto("http://localhost:8080/reportly", { waitUntil:"load", timeout:45000 });
await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,400)); });
await p.screenshot({ path:"/tmp/shots/reportly2.png", fullPage:true });
console.log("ok"); await b.close();
