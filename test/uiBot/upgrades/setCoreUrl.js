require('hjson/lib/require-config');
const URI = require('../../appUri.hjson');

module.exports = function (uiBot) {
	uiBot.__setCoreUrl = async function (page, uiUrl, apiUrl) {
		await page.goto(uiUrl + URI.SETTINGS.NAVIGATE, {
			waitUntil: 'domcontentloaded',
		});

		await page.waitForSelector('#settings-advanced');
		await page.click('#settings-advanced');

		await page.waitForSelector(
			'#main-content > div.container-fluid > div > div > div > div > button'
		);
		await page.click('#main-content > div.container-fluid > div > div > div > div > button');

		await page.$eval('input#server-url', (el, apiUrl) => (el.value = apiUrl), apiUrl);

		await page.click(URI.MODAL_PRIMARY_BUTTON);

		await page.click('#settings-advanced');
	};
};
