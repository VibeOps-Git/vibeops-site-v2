import { chromium } from "playwright";
const browser = await chromium.launch();
for (const scheme of ["light","dark"]) {
  const ctx = await browser.newContext({ colorScheme:scheme, viewport:{width:1366,height:900}});
  const page = await ctx.newPage();
  await page.goto("http://localhost:8080/contact?mode=email", { waitUntil:"load", timeout:45000 });
  await new Promise(r=>setTimeout(r,1500));
  const btn = page.getByRole('button', { name: /Contact Zander/i }).first();
  await btn.hover();
  await new Promise(r=>setTimeout(r,400));
  await page.screenshot({ path:`/tmp/shots/contact-hover-${scheme}.png` });
  console.log("ok "+scheme);
  await ctx.close();
}
await browser.close();
