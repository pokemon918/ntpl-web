import {click, startFromNewTasting} from '../../include';

export default function () {
	describe('Subscription Pro', function () {
		beforeEach(cy.restoreLoginState);

		it('Login as user with Pro plan', () => {
			cy.login(Cypress.env('PRO_USER'));
		});

		it('New Quick Tasting', function () {
			startFromNewTasting();
			// chose the tasting method
			click('selecting__quick');
			cy.url().should('include', '/tasting/new/quick');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a profound tasting', function () {
			startFromNewTasting();

			// chose the tasting method
			click('selecting__profound');
			cy.url().should('include', '/tasting/new/profound');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a scholar  tasting', function () {
			startFromNewTasting();

			click('selecting__scholar');
			cy.contains(`You need an upgrade`);
			click('DialogBox__noBtn');
		});
	});
}
