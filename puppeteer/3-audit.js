const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');
const { parseCoverage, sortCoverage, sumTotals } = require('./audit-helpers');

const runLighthouse = async url => {
  // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: null,
  });

  // Wait for Lighthouse to open url, then customize network conditions.
  // Note: this will re-establish these conditions when LH reloads the page. Think that's ok....
  browser.on('targetchanged', async target => {
    const page = await target.page();

    if (page && page.url() === url) {
      await page.target().createCDPSession();
    }
  });

  // Lighthouse will open URL. Puppeteer observes `targetchanged` and sets up network conditions.
  // Possible race condition.
  const { lhr } = await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    // logLevel: 'info',
  });

  await browser.close();
  return lhr;
};

const runCoverage = async url => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

  await page.goto(url);

  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  await browser.close();

  const cssCoverageReport = cssCoverage.map(parseCoverage).sort(sortCoverage);
  const jsCoverageReport = jsCoverage.map(parseCoverage).sort(sortCoverage);
  const unusedCss = cssCoverageReport.reduce(sumTotals, { unusedBytes: 0, totalBytes: 0 });
  const unusedJs = jsCoverageReport.reduce(sumTotals, { unusedBytes: 0, totalBytes: 0 });

  const unusedCssPercentage = (unusedCss.unusedBytes / unusedCss.totalBytes).toFixed(2);
  const unusedJsPercentage = (unusedJs.unusedBytes / unusedJs.totalBytes).toFixed(2);
  return {
    css: {
      ...unusedCss,
      unusedPercentage: unusedCssPercentage,
    },

    js: {
      ...unusedJs,
      unusedPercentage: unusedJsPercentage,
    },
  };
};

(async () => {
  const url = 'https://10clouds.com/';
  const lighthouseReport = await runLighthouse(url);

  console.log(`\n LIGHTHOUSE ANALYSIS for: ${url}\n`);
  console.log('\n SUMMARY SCORE \n');
  for (let category in lighthouseReport.categories) {
    console.log(category, lighthouseReport.categories[category].score);
  }

  const myMetrics = [
    'first-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'first-cpu-idle',
    'interactive',
  ];

  console.log('\n TIMINGS \n');
  myMetrics.forEach(show => console.log(show, lighthouseReport.audits[show].displayValue));

  console.log('\n CODE COVERAGE ANALYSIS \n');
  const { css, js } = await runCoverage(url);
  console.log({ css, js });
})();
