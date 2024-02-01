const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1';
const url = process.env.BASE_URL_PORT || `${BASE_URL}:${PORT}`;

class UiBot {
	start = async function (conf) {
		conf = {
			...{width: 1280, height: 800, url, headless: false, slowMo: 100, devtools: false},
			...conf,
		};
		this.page = null;
		browser = await puppeteer.launch(conf);
		this.page = await browser.newPage();
		await page.setViewport(conf);
		await page.goto(conf.url, {waitUntil: 'domcontentloaded'});
	};

	stop = async function () {
		await browser.close();
	};

	click = async function (cssSelector) {
		await page.waitForSelector(cssSelector);
		await page.click(cssSelector);
	};

	type = async function (cssSelector, text) {
		//await page.type('#server-url', 'China') // It will write at the end of the existing content
		await page.evaluate(function (cssSelector) {
			document.querySelector(cssSelector).value = '';
		}, cssSelector);
		await page.type(cssSelector, text);
	};
}

module.exports = new UiBot();
