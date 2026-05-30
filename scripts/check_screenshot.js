import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: "screenshot.png" });
    console.log("Screenshot saved to screenshot.png");
    
  } catch (e) {
    console.log("Error:", e.message);
  }

  await browser.close();
})();
