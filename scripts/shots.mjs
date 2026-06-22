import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["reportly", "/reportly"],
  ["services", "/services"],
  ["team", "/team"],
  ["contact", "/contact"],
  ["case-studies", "/case-studies"],
  ["blog", "/blog"],
];
const schemes = ["light", "dark"];

const browser = await chromium.launch();
for (const scheme of schemes) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    try {
      await page.goto(`http://localhost:8080${path}`, { waitUntil: "networkidle", timeout: 30000 });
      // Scroll through to trigger in-view reveal animations.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
      await page.screenshot({ path: `${OUT}/${name}-${scheme}.png`, fullPage: true });
      console.log(`ok ${name}-${scheme}`);
    } catch (e) {
      console.log(`FAIL ${name}-${scheme}: ${e.message}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log("done");
