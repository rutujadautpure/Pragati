const puppeteer = require('puppeteer-core');  

(async () => {
   const browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',  // Path to your local Chrome or Chromium
   });
   
   const page = await browser.newPage();
   await page.goto('https://example.com');  // Change URL as needed
   await page.screenshot({ path: 'example.png' });  // Save screenshot in the project folder
   await browser.close();
})();
