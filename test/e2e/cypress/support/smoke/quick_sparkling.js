import {click, clicks, clickNext, startFromMyTasting, startFromNewTasting} from '../include';
const tastingInfo = JSON.parse(Cypress.env('tastingInfo'));
const uniqueName = `${tastingInfo.tasting_name}_${new Date().toISOString()}`;

describe('Quick Tasting > Sparkling', function () {
	afterEach(function () {
		if (this.currentTest.state === 'failed') {
			Cypress.runner.stop();
		}
	});

	it('New Quick Tasting', function () {
		startFromNewTasting();

		// chose the tasting method
		click('selecting__quick');

		cy.get('[data-test=tasting_name]').type(uniqueName, {force: true});

		clicks('tasting_vintage', 'YearPicker__value__2019');

		clickNext();

		// wine type
		clicks('selecting__category_sparkling', 'selecting__nuance_white');

		clickNext();

		clicks(
			'selecting__noseintensity_pronounced',
			'selecting__autolytic_pronounced',
			'selecting__development_fullydeveloped',
			'selecting__sweetness_luscious',
			'selecting__acidity_high',
			'selecting__tannins_high',
			'selecting__alcohol_high',
			'selecting__body_full',
			'selecting__quality_outstanding'
		);

		clickNext(1);

		cy.get('[data-test=saveBtn] button').click({force: true});

		clicks('backToNewTasting', 'backToMyTastings');

		cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

		cy.contains(uniqueName);
	});

	it('Delete created quick sparkling tasting', function () {
		startFromMyTasting();

		cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

		cy.contains(uniqueName);

		click('deleteTasting', 1);
		click('DialogBox__yesBtn', 1);

		cy.contains(uniqueName).should('not.exist');
	});
});
