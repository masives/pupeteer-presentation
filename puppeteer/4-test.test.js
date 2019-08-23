const puppeteer = require('puppeteer');

const pageObject = {
  generateNumberButton: '.generate-number-button',
  generatedNumber: '.lucky-number',
  submitButton: 'form button',
  luckyNumberInput: 'form input',
};

let page;
let browser;
describe('Super lottery', () => {
  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });

    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should clear input on submission', async () => {
    // given
    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });

    // when
    await page.click(pageObject.generateNumberButton);
    const luckyNumber = await page.$eval(pageObject.generatedNumber, el => el.innerText);

    await page.focus('input');
    await page.keyboard.type(luckyNumber);
    await page.keyboard.press('Enter');

    // then
    const luckyNumberInput = await page.$eval(pageObject.luckyNumberInput, el => el.value);
    expect(luckyNumberInput).toEqual('');
  });

  it('should show error on submitting empty input', async () => {
    // when
    await page.focus('input');
    await page.keyboard.press('Enter');

    // then
    const error = await page.$eval('.error', el => el.innerText);
    expect(error).toEqual('Give me you lucky number dumbo');
  });

  it('should not allow user to win', async () => {
    const spy = jest.fn();
    // given
    page.on('dialog', async dialog => {
      spy();
      await dialog.dismiss();
    });

    // when
    await page.click(pageObject.generateNumberButton);
    const luckyNumber = await page.$eval(pageObject.generatedNumber, el => el.innerText);

    await page.focus('input');
    await page.keyboard.type(luckyNumber);
    await page.keyboard.press('Enter');

    // then
    expect(spy).toHaveBeenCalled();
  });
});
