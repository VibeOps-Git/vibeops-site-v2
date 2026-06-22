import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ colorScheme:"light", viewport:{width:1366,height:860}});
const p = await c.newPage();
await p.goto("http://localhost:8080/reportly", { waitUntil:"load", timeout:45000 });
const tops = await p.evaluate(()=>{ const s=[...document.querySelectorAll('section')].find(el=>el.offsetHeight>window.innerHeight*3); return s? s.offsetTop : 0; });
let i=0;
for (const frac of [0.15, 0.45, 0.75]) {
  await p.evaluate(({tops,frac})=>{ window.scrollTo(0, tops + window.innerHeight*4*frac); }, {tops,frac});
  await new Promise(r=>setTimeout(r,1000));
  await p.screenshot({ path:`/tmp/shots/showcase-${i}.png` });
  console.log("ok "+i); i++;
}
await b.close();
