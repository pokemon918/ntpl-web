import {click, clicks, clickNext, startFromMyTasting, startFromNewTasting} from '../include';
const tastingInfo = JSON.parse(Cypress.env('tastingInfo'));
const uniqueName = `${tastingInfo.tasting_name}_${new Date().toISOString()}`;

describe('Profound Tasting', function () {
	beforeEach(function () {
		cy.viewport('iphone-6');
	});

	afterEach(function () {
		if (this.currentTest.state === 'failed') {
			Cypress.runner.stop();
		}
	});

	it('Create a mobile profound tasting', function () {
		startFromNewTasting();

		click('selecting__profoundMobile');

		cy.get('[data-test=tasting_name]').type(uniqueName, {force: true});

		clicks('tasting_vintage', 'YearPicker__value__2019');

		clickNext();

		clicks(
			'selecting__category_still',
			'selecting__nuance_white',
			'selecting__nuance_lemongreen',
			'selecting__clarity_clear',
			'selecting__colorintensity_deep',
			'selecting__condition_clean',
			'selecting__noseintensity_pronounced',
			'selecting__development_fullydeveloped'
		);

		clickNext(18);

		clicks(
			'selecting__sweetness_luscious',
			'selecting__acidity_high',
			'selecting__alcohol_high',
			'selecting__body_full',
			'selecting__palateintensity_pronounced',
			'selecting__finish_long'
		);

		clickNext(17);

		clicks('selecting__quality_outstanding', 'selecting__readiness_tooyoung');

		clickNext(2);

		cy.get('[data-test=saveBtn] button').click({force: true});

		clicks('backToNewTasting', 'backToMyTastings');

		cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

		cy.contains(uniqueName);
	});

	it('Delete created mobile profound tasting', function () {
		startFromMyTasting();

		cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

		cy.contains(uniqueName);

		click('deleteTasting', 1);
		click('DialogBox__yesBtn', 1);

		cy.contains(uniqueName).should('not.exist');
	});
});
