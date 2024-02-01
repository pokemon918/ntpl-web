import {click, startFromNewTasting} from '../../include';

export default function () {
	describe('Subscription View', function () {
		beforeEach(cy.restoreLoginState);

		it('Login as user with View plan', () => {
			cy.login(Cypress.env('VIEW_USER'));
		});

		it('New Quick Tasting', function () {
			startFromNewTasting();

			click('selecting__quick');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});

		it('Create a scholar tasting', function () {
			startFromNewTasting();

			click('selecting__profound');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});

		it('Create a scholar tasting', function () {
			startFromNewTasting();

			click('selecting__scholar');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});
	});
}
