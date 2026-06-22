import { chromium } from "playwright";
const b = await chromium.launch();
// iPhone SE full-page (scroll to trigger reveals)
async function full(w,h,name){
  const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,colorScheme:"light"});
  const p=await c.newPage();
  await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
  await new Promise(r=>setTimeout(r,4500));
  await p.screenshot({path:`/tmp/mobile/${name}-top.png`}); // viewport top with device
  const ov=await p.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth);
  await c.close(); console.log(`${name} overflowX=${ov}`);
}
await full(375,667,"se");
await full(390,844,"m390");
// desktop unchanged check
const c=await b.newContext({viewport:{width:1440,height:900},colorScheme:"light"});
const p=await c.newPage();
await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
await new Promise(r=>setTimeout(r,3500));
await p.screenshot({path:"/tmp/shots/desktop-home2.png"});
console.log("desktop ok");
await b.close();
