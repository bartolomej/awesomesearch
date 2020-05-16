const puppeteer = require('puppeteer');
const path = require('path');


async function init () {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'production'
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1300,
    height: 1000,
    deviceScaleFactor: 1,
  });
  return [page, browser];
}

async function landingImage (url, outputPath ) {
  const [page, browser] = await init();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: outputPath });
  await browser.close();
}

async function recordPreview (url, outputDir) {
  const [page, browser] = await init();
  await page.goto(url, { waitUntil: 'networkidle2' });

  let frameCount = 0;
  let isScrolling = true;
  while (isScrolling) {
    await page.screenshot({ path: path.join(outputDir, `out_${frameCount}.png`) });
    await page.evaluate(async () => {
      const pageHeight = window.innerHeight;
      const scrollPos = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, 10);
      if (scrollPos + pageHeight >= scrollHeight) {
        isScrolling = false;
      }
    });
    frameCount++;
  }

  await browser.close();
}

// TODO: transform images to video
//  https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
// https://github.com/puppeteer/puppeteer/issues/478

module.exports = {
  landingImage,
  recordPreview,
}
