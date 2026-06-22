import { chromium } from "playwright";
const browser = await chromium.launch();
for (const scheme of ["light","dark"]) {
  const ctx = await browser.newContext({ colorScheme:scheme, viewport:{width:1366,height:900}});
  const page = await ctx.newPage();
  await page.goto("http://localhost:8080/contact", { waitUntil:"load", timeout:45000 });
  await new Promise(r=>setTimeout(r,2500));
  await page.screenshot({ path:`/tmp/shots/contact-${scheme}.png`, fullPage:true });
  console.log("ok contact-"+scheme);
  await ctx.close();
}
await browser.close();
