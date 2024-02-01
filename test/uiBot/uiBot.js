require('hjson/lib/require-config');
const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const upgrade = require('./upgrade');
const log = require('./log');
const URI = require('../appUri.hjson');
const path = require('path');

const SHOW_BROWSER = !!+process.env.SHOW_BROWSER;
const PORT = process.env.PORT || 3000;
const uiUrl = process.env.UI_URL || `http://localhost:${PORT}`;
const apiUrl = process.env.API_URL || URI.ENV.DEFAULT_API_URL;

function uiBot() {
	let uiBot = {log};
	let page = null;
	let browser = {close: () => {}};

	uiBot.start = async function (conf) {
		conf = {
			...{
				width: 1280,
				height: 800,
				url: uiUrl,
				headless: !SHOW_BROWSER,
				args: ['--no-sandbox'],
				slowMo: SHOW_BROWSER ? 200 : 20,
				devtools: false,
				apiUrl,
			},
			...conf,
		};
		log.level++;
		//if(null !== page) return;
		log('Starting uiBot', conf);
		try {
			browser = await puppeteer.launch(conf);
			page = await browser.newPage();
			await page.setViewport(conf);
			await uiBot.__setCoreUrl(page, uiUrl, apiUrl);

			await page.goto(conf.url, {waitUntil: 'domcontentloaded'});
		} catch (e) {
			try {
				await browser.close();
			} catch (e) {}
			throw e;
		}
	};

	uiBot.stop = async function () {
		log.level--;
		//return;
		log('Stopping uiBot');

		await browser.close();
	};

	uiBot.click = async function (cssSelector) {
		log('Click', cssSelector);

		await page.waitForSelector(cssSelector);
		await page.click(cssSelector);
	};
	uiBot.getText = async function (cssSelector) {
		log('Text', cssSelector);

		await page.waitForSelector(cssSelector);
		console.log(page.Text());
		//return page.Text();
	};

	uiBot.waiterClick = async function (cssSelector, waittime) {
		log('Waiter', cssSelector);
		await page.waitForSelector(cssSelector, {timeout: waittime});
		page.waitForNavigation({waitUntil: 'networkidle0'}), await page.click(cssSelector);
	};
	uiBot.type = async function (cssSelector, text) {
		log('Typing into', cssSelector);

		//v1
		//await page.type('#server-url', 'China') // It will write at the end of the existing content

		//v2
		await page.evaluate(function (cssSelector) {
			document.querySelector(cssSelector).value = '';
		}, cssSelector);
		await page.type(cssSelector, text);

		//await page.$eval(cssSelector, (el, text) => (el.value = text), text);
	};
	uiBot.getTextFromSeletor = async function (cssSelector) {
		log('Checking value from ', cssSelector);
		await page.waitForSelector(cssSelector, 30000);
		//const innerText = await page.evaluate((cssSelector) => document.querySelector(cssSelector).innerHTML);

		let innerText = await page.evaluate(async function (cssSelector) {
			return document.querySelector(cssSelector).innerHTML;
		}, cssSelector);
		log('Displaying the value ', innerText);
		return innerText;
	};

	uiBot.snapshot = async function (callingFilePath) {
		let dir = path.resolve(path.dirname(callingFilePath), '../', URI.ENV.SNAPSHOT_PATH);
		mkdirp.sync(dir);

		let date = new Date().toISOString().replace(/:/g, '.');
		let callingFilename = path.basename(callingFilePath, '.js');
		let filename = `${date}_${callingFilename}.png`;

		let fullPath = path.resolve(dir, filename);

		log('Saving screen', fullPath);
		await page.screenshot({path: fullPath, fullPage: true});
	};

	uiBot.goto = async function (url) {
		log('Going to', url);
		await page.goto(uiUrl + url, {timeout: 0, waitUntil: 'networkidle0'});
	};

	uiBot.page = page;

	upgrade(uiBot);

	return uiBot;
}

module.exports = {uiBot: uiBot(), URI, uiUrl, apiUrl};
