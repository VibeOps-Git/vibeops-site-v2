import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme:"light", viewport:{width:1366,height:900}});
const page = await ctx.newPage();
await page.goto("http://localhost:8080/team", { waitUntil:"load", timeout:45000 });
await page.evaluate(async()=>{ for(let y=0;y<2200;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} });
// scroll to the core cards area
await page.evaluate(()=>{ const el=[...document.querySelectorAll('h3')].find(h=>h.textContent.includes('Félix')||h.textContent.includes('Felix')); if(el) el.scrollIntoView({block:'center'}); });
await new Promise(r=>setTimeout(r,800));
await page.screenshot({ path:"/tmp/shots/team-cards.png" });
console.log("ok");
await browser.close();
