import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme:"light", viewport:{width:1366,height:860}});
const page = await ctx.newPage();
await page.goto("http://localhost:8080/", { waitUntil:"load", timeout:45000 });
await new Promise(r=>setTimeout(r,6200)); // wait for phone phase
await page.screenshot({ path:"/tmp/shots/phone-phase.png" });
console.log("ok");
await browser.close();
