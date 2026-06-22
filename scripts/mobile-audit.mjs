import { chromium } from "playwright";
const pages = [["home","/"],["reportly","/reportly"],["services","/services"],["team","/team"],["contact","/contact"],["case-studies","/case-studies"],["blog","/blog"]];
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true, colorScheme:"light" });
const p = await c.newPage();
for (const [name,path] of pages){
  try{
    await p.goto(`http://localhost:8080${path}`,{waitUntil:"load",timeout:40000});
    await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=window.innerHeight*0.6){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,400)); });
    // check horizontal overflow
    const ov = await p.evaluate(()=>Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    await p.screenshot({ path:`/tmp/mobile/${name}.png`, fullPage:true });
    console.log(`${name}: overflowX=${ov}px`);
  }catch(e){ console.log(`${name} FAIL ${e.message.split('\n')[0]}`); }
}
await b.close();
