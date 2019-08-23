const puppeteer = require('puppeteer')


const run = async ()=> {
    const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.goto('https://example.com');

console.log(await page.content());
await page.screenshot({path: 'screenshot.png'});

await browser.close();

}

run()