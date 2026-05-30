import puppeteer from "puppeteer";

(async () => {
  console.log("Launching headless browser to check http://localhost:5173/...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]: ${msg.text()}`);
  });

  page.on("pageerror", (err) => {
    console.log(`[BROWSER RUNTIME ERROR]: ${err.stack || err.toString()}`);
  });

  try {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 15000 });
    
    // Wait for a few seconds to let any runtime errors happen
    await new Promise(r => setTimeout(r, 5000));
    
    // Check for Vite error overlay
    const overlayText = await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay');
      if (overlay && overlay.shadowRoot) {
        return overlay.shadowRoot.textContent;
      }
      return null;
    });
    
    if (overlayText) {
      console.log("[VITE ERROR OVERLAY]:", overlayText.substring(0, 1000));
    } else {
      console.log("No Vite error overlay found.");
      // Check for any body text
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log("[BODY TEXT]:", bodyText.substring(0, 500));
      // Check body background
      const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      console.log("[BODY BG COLOR]:", bgColor);
    }
    
  } catch (e) {
    console.log("Navigation timed out or failed:", e.message);
  }

  await browser.close();
})();
