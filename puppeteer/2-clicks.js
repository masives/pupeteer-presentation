const puppeteer = require('puppeteer');

const pageObject = {
  generateNumberButton: '.generate-number-button',
  generatedNumber: '.lucky-number',
  submitButton: 'form button',
  luckyNumberInput: 'form input',
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  page.on('dialog', async dialog => {
    //   you cannot screenshot while in dialog
    await dialog.dismiss();
    console.log(dialog.message());
  });

  //   generate number
  await page.click(pageObject.generateNumberButton);
  await page.screenshot({ path: 'screenshot-1.png' });

  //   get number
  const luckyNumber = await page.$eval(pageObject.generatedNumber, el => el.innerText);

  // fill number
  await page.focus(pageObject.luckyNumberInput);
  await page.keyboard.type(luckyNumber);
  await page.screenshot({ path: 'screenshot-2.png' });

  // submit
  await page.keyboard.press('Enter');
  await page.screenshot({ path: 'screenshot-3.png' });

  await browser.close();
};

run();
