import { chromium } from "playwright";
const b = await chromium.launch();
const c=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,colorScheme:"light"});
const p=await c.newPage();
await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
await new Promise(r=>setTimeout(r,6200)); // phone phase
await p.evaluate(()=>window.scrollTo(0,420)); // scroll to device+logos
await new Promise(r=>setTimeout(r,500));
await p.screenshot({path:"/tmp/mobile/se-device.png"});
console.log("ok"); await b.close();
