const uiBot = require('../uiBot/uiBot');

(async () => {
	await uiBot.start({headless: true});

	uiBot.log('Open settings	');
	await uiBot.navbar('/settings');

	uiBot.log('Open advanced settings');
	await uiBot.click('#settings-advanced');
	await uiBot.click('#main-content > div.container-fluid > div > div > div > div > button');

	uiBot.log('Change endpoint url');
	await uiBot.type('input#server-url', 'http://core.winenode.com');
	await uiBot.click(
		'#main-content > div.container-fluid > div > div > div > div.modal.fade.top.show > div > div > div.modal-footer > button.btn.btn-primary.Ripple-parent'
	);
	await uiBot.stop();
})();

/*
afterEach(function() {
  if (this.currentTest.state == 'failed') {
    // ... take picture and save as artifactte
  }
});
*/
