import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme:"light", viewport:{width:1366,height:1000}});
const page = await ctx.newPage();
await page.goto("http://localhost:8080/contact?mode=email", { waitUntil:"load", timeout:45000 });
await new Promise(r=>setTimeout(r,2500));
await page.screenshot({ path:"/tmp/shots/contact-email.png", fullPage:true });
console.log("ok");
await browser.close();
