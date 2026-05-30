import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 15000 });
    
    const bgInfo = await page.evaluate(() => {
      return {
        htmlBg: window.getComputedStyle(document.documentElement).backgroundColor,
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        htmlClass: document.documentElement.className
      };
    });
    
    console.log(JSON.stringify(bgInfo, null, 2));
    
  } catch (e) {
    console.log("Error:", e.message);
  }

  await browser.close();
})();
