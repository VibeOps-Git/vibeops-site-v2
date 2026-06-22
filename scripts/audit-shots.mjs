import { chromium } from "playwright";
import { mkdirSync } from "fs";
mkdirSync("/tmp/audit", { recursive: true });
const pages = [
  ["services","/services"],["case-studies","/case-studies"],
  ["team","/team"],["blog","/blog"],["reportly","/reportly"],
  ["privacy","/privacy"],["terms","/terms"],["notfound","/zzz-nope"],
];
const browser = await chromium.launch();
for (const scheme of ["light","dark"]) {
  const ctx = await browser.newContext({ colorScheme:scheme, viewport:{width:1366,height:900}});
  const page = await ctx.newPage();
  for (const [name,path] of pages) {
    try {
      await page.goto(`http://localhost:8080${path}`, { waitUntil:"load", timeout:40000 });
      await page.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=window.innerHeight*0.7){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,400)); });
      await page.screenshot({ path:`/tmp/audit/${name}-${scheme}.png`, fullPage:true });
      console.log(`ok ${name}-${scheme}`);
    } catch(e){ console.log(`FAIL ${name}-${scheme}: ${e.message.split('\n')[0]}`); }
  }
  await ctx.close();
}
await browser.close();
