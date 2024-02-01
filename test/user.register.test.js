const assert = require('chai').assert;
const {uiBot, URI, apiUrl} = require('./uiBot/uiBot');
const log = uiBot.log;

describe('Settings', () => {
	afterEach(async function () {
		if (this.currentTest.state == 'failed') {
			await uiBot.snapshot(__filename);
		}
	});
	describe('User credentials', () => {
		describe('REgister user', () => {
			log.it('Enter email', async () => {
				await uiBot.goto(URI.SETTINGS.NAVIGATE);
			});

			log.it('Enter password', async () => {
				await uiBot.click(URI.SETTINGS.ADVANCED_OPEN);
				await uiBot.click(URI.SETTINGS.CORE_API_OPEN);
			});

			log.it('Click to register', async () => {
				await uiBot.type(URI.SETTINGS.CORE_API_INPUT, apiUrl);
				await uiBot.click(URI.MODAL_PRIMARY_BUTTON);
			});
		});

		xdescribe('Verify result', () => {
			log.it('Looks OK', async () => {
				assert(1, 1);
			});
		});
	});
});

/*
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
