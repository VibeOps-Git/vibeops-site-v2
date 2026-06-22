import { chromium } from "playwright";
const browser = await chromium.launch();
for (const scheme of ["light","dark"]) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport:{width:1366,height:900}});
  const page = await ctx.newPage();
  await page.goto("http://localhost:8080/", { waitUntil:"load", timeout:45000 });
  await page.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=window.innerHeight*0.7){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,600)); });
  await page.screenshot({ path:`/tmp/shots/home-${scheme}.png`, fullPage:true });
  console.log("ok home-"+scheme);
  await ctx.close();
}
await browser.close();
