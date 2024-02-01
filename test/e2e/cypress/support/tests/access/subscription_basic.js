import {click, startFromNewTasting} from '../../include';

export default function () {
	describe('Subscriptoin Basic', function () {
		beforeEach(cy.restoreLoginState);

		it('Login as user with Basic plan', () => {
			cy.login(Cypress.env('BASIC_USER'));
		});

		it('New Quick Tasting', function () {
			startFromNewTasting();

			// chose the tasting method
			click('selecting__quick');
			cy.url().should('include', '/tasting/new/quick');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a Profound tasting', function () {
			startFromNewTasting();

			click('selecting__profound');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});

		it('Create a Scholar tasting', function () {
			startFromNewTasting();

			click('selecting__scholar');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});
	});
}
