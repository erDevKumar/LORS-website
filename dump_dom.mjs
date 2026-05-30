import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--use-gl=egl', '--ignore-gpu-blocklist', '--enable-webgl']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const html = await page.content();
  console.log(html);
  await browser.close();
})();
