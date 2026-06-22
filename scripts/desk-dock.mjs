import { chromium } from "playwright";
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:1440,height:900},colorScheme:"light"});
const p=await c.newPage();
await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
await new Promise(r=>setTimeout(r,2000));
await p.evaluate(()=>window.scrollTo(0,window.innerHeight*1.05)); // mid hero-exit
await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:"/tmp/shots/desk-dock.png"});
console.log("ok"); await b.close();
