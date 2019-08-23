const puppeteer = require('puppeteer');

const pageObject = {
  generateNumberButton: '.generate-number-button',
  generatedNumber: '.lucky-number',
  submitButton: 'form button',
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001');

  page.on('dialog', async dialog => {
    //   dialogu nie da sie zeskrinszotować
    await dialog.dismiss();
    console.log(dialog.message());
  });

  //   generate number
  await page.click(pageObject.generateNumberButton);
  //   await page.screenshot({ path: 'screenshot.png' });

  //   get number
  const luckyNumber = await page.$eval(pageObject.generatedNumber, el => el.innerText);

  // fill number
  await page.focus('input');
  await page.keyboard.type(luckyNumber);
  //   await page.screenshot({ path: '4-screenshot-typing.png' });

  // submit
  await page.keyboard.press('Enter');
  //   await page.screenshot({ path: '4-screenshot-enter.png' });

  await browser.close();
};

run();
