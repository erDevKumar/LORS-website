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
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 8000 });
  } catch (e) {
    console.log("Navigation timed out or failed:", e.message);
  }

  await browser.close();
})();
