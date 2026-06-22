import { chromium } from "playwright";
const b = await chromium.launch();
async function shot(w,h,name,waitMs){
  const c = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, isMobile:true, colorScheme:"light" });
  const p = await c.newPage();
  await p.goto("http://localhost:8080/",{waitUntil:"load",timeout:45000});
  await new Promise(r=>setTimeout(r,waitMs));
  await p.screenshot({ path:`/tmp/mobile/${name}.png` });
  await c.close(); console.log("ok "+name);
}
await shot(375,667,"se-laptop",1600);   // phase 1 laptop
await shot(375,667,"se-phone",6200);     // phase 3 phone
await shot(390,844,"tall-phone",6200);   // tall phone, phone phase
await b.close();
