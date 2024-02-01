import {click, startFromNewTasting} from '../../include';

export default function () {
	describe('Subscription Scholar', function () {
		beforeEach(cy.restoreLoginState);

		it('Login as user with Scholar plan', () => {
			cy.login(Cypress.env('SCHOLAR_USER'));
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

			click('selecting__profound');
			cy.url().should('include', '/tasting/new/profound');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a scholar2 tasting', function () {
			startFromNewTasting();

			click('selecting__scholar2');
			cy.url().should('include', '/tasting/new/scholar2');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a scholar3 tasting', function () {
			startFromNewTasting();

			click('selecting__scholar3');
			cy.url().should('include', '/tasting/new/scholar3');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});

		it('Create a scholar4 tasting', function () {
			startFromNewTasting();

			click('selecting__scholar4');
			cy.url().should('include', '/tasting/new/scholar4');
			click('Modal__closeBtn');
			click('DialogBox__yesBtn');
		});
	});
}
