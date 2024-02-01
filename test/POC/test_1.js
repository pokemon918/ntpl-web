const puppeteer = require('puppeteer');
const url = 'http://127.0.0.1:3000';

(async () => {
	//const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless: false, slowMo: 100, devtools: false});
	const page = await browser.newPage();
	await page.setViewport({width: 1280, height: 800});
	await page.goto(url, {waitUntil: 'domcontentloaded'});

	await page.waitForSelector('.navbar-brand');
	await page.click('.navbar-brand');

	await page.waitForSelector('#AppSideNav > div > a[href="/settings"]');
	await page.click('#AppSideNav > div > a[href="/settings"]');

	await page.waitForSelector('#settings-advanced');
	await page.click('#settings-advanced');

	await page.waitForSelector(
		'#main-content > div.container-fluid > div > div > div > div > button'
	);
	await page.click('#main-content > div.container-fluid > div > div > div > div > button');

	//await page.type('#server-url', 'China') // It will write at the end of the existing content
	await page.evaluate(function () {
		document.querySelector('input#server-url').value = '';
	});
	await page.type('input#server-url', 'http://core.winenode.com');

	await page.click(
		'body > div:nth-child(4) > span > div.modal.fade.show > div > div > div.modal-footer > button.btn.btn-primary.Ripple-parent'
	);

	// console.log(await page.evaluate('1 + 2')); // prints "3"
	// const innerText = await page.evaluate(() => document.querySelector('p').innerText);

	//let input = await page.$('input');
	//let valueHandle = await input.getProperty('value');
	//assert.equal(await valueHandle.jsonValue(), 'some text')

	await browser.close();
})();
