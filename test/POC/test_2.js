const uiBot = require('../uiBot');

(async () => {
	await uiBot.start();
	await uiBot.click('.navbar-brand');
	await uiBot.click('#AppSideNav > div > a[href="/settings"]');
	await uiBot.click('#settings-advanced');
	await uiBot.click('#main-content > div.container-fluid > div > div > div > div > button');
	await uiBot.type('input#server-url', 'http://core.winenode.com');
	await uiBot.click(
		'body > div:nth-child(4) > span > div.modal.fade.show > div > div > div.modal-footer > button.btn.btn-primary.Ripple-parent'
	);
	await uiBot.stop();
})();
