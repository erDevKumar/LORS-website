import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const canvasInfo = await page.evaluate(() => {
      const canvasRoot = document.querySelector('.bg-lors-navy.fixed.inset-0');
      const canvas = document.querySelector('canvas');
      const htmlClasses = document.documentElement.className;
      return {
        hasCanvasRoot: !!canvasRoot,
        canvasRootClasses: canvasRoot ? canvasRoot.className : null,
        canvasRootZIndex: canvasRoot ? window.getComputedStyle(canvasRoot).zIndex : null,
        canvasRootBg: canvasRoot ? window.getComputedStyle(canvasRoot).backgroundColor : null,
        hasCanvas: !!canvas,
        canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
        htmlClasses
      };
    });
    
    console.log(JSON.stringify(canvasInfo, null, 2));
    
  } catch (e) {
    console.log("Error:", e.message);
  }

  await browser.close();
})();
