const assert = require('chai').assert;
const expect = require('chai').expect;
const {uiBot, URI, apiUrl, uiUrl} = require('./uiBot/uiBot');
const log = uiBot.log;
const wineName = 'My Testing Wine';

describe('User Login', () => {
	afterEach(async function () {
		if (this.currentTest.state === 'failed') {
			await uiBot.snapshot(__filename);
		}
	});
	describe('User credentials', () => {
		describe('Change url', () => {
			log.it('Open settings', async () => {
				await uiBot.goto(URI.SETTINGS.NAVIGATE);
			});

			log.it('Open advanced settings', async () => {
				await uiBot.click(URI.SETTINGS.ADVANCED_OPEN);
				await uiBot.click(URI.SETTINGS.CORE_API_OPEN);
			});

			log.it('Change endpoint url', async () => {
				await uiBot.type(URI.SETTINGS.CORE_API_INPUT, apiUrl);
				await uiBot.click(URI.MODAL_PRIMARY_BUTTON);
			});
		});
		describe('Login with existing user', () => {
			log.it('Enter email', async () => {
				await uiBot.goto('');
				await uiBot.click(URI.SETTINGS.USER_LOGIN_EMAIL);
				await uiBot.type(URI.SETTINGS.USER_LOGIN_EMAIL, URI.SETTINGS.USER_EMAIL);
			});

			log.it('Enter password', async () => {
				await uiBot.click(URI.SETTINGS.USER_LOGIN_PW);
				await uiBot.type(URI.SETTINGS.USER_LOGIN_PW, URI.SETTINGS.USER_PW);
			});

			log.it('Click to login', async () => {
				uiBot.waiterClick(URI.SETTINGS.USER_LOGIN_BUTTON, 24000);
			});
		});
		describe('New Tasting', () => {
			log.it('Click to new_tasting', async () => {
				await uiBot.waiterClick('#main-content a[href="/new-tasting"]', 24000);
			});

			log.it('Click to Nectar tasting', async () => {
				await uiBot.click('a[href="/new-tasting/nectar"]');
			});

			log.it('Click to next for info page', async () => {
				await uiBot.click('button.next-btn');
			});

			log.it('Click to tasting_name ', async () => {
				await uiBot.click('#tasting_Name');
				await uiBot.type('#tasting_Name', wineName);
			});

			log.it('Click to save button', async () => {
				await uiBot.click('#main-content button.save-btn ');
			});
			log.it('Go to Wine Page', async () => {
				let promise1 = await Promise.resolve(uiBot.goto('/wines'));
				await Promise.all([promise1]);
			});
			log.it('click my wine card', async () => {
				await uiBot.waiterClick(
					'#main-content div.wines-containers-cols-container div.wine-list-col h4.card-title',
					10000
				);
			});
		});
		xdescribe('Verify result', () => {
			log.it('Looks OK', async () => {
				let NewWine = await uiBot.getTextFromSeletor('#main-content span.wine-name');
				expect(NewWine).to.equal(wineName);
			});
		});
	});
});
