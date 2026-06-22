import { chromium } from "playwright";
const browser = await chromium.launch();
for (const scheme of ["light","dark"]) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport:{width:1366,height:860}});
  const page = await ctx.newPage();
  await page.goto("http://localhost:8080/", { waitUntil:"load", timeout:45000 });
  await new Promise(r=>setTimeout(r,3500)); // let devices cycle to show one
  await page.screenshot({ path:`/tmp/shots/top-${scheme}.png` }); // viewport only
  console.log("ok top-"+scheme);
  await ctx.close();
}
await browser.close();
