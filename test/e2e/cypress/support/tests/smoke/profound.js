import {
	click,
	clicks,
	clickNext,
	clickBack,
	contains,
	notContains,
	startFromMyTasting,
	startFromNewTasting,
} from '../../include';
const tastingInfo = JSON.parse(Cypress.env('tastingInfo'));
const uniqueName = `${tastingInfo.tasting_name}_${new Date().toISOString()}`;

export default function () {
	describe('Profound Tasting', function () {
		beforeEach(cy.restoreLoginState);

		it('Login as default user', () => {
			cy.login();
		});

		it('Create a profound tasting', function () {
			startFromNewTasting();

			click('selecting__profound');

			cy.get('[data-test=tasting_name]').type(uniqueName, {force: true});

			clicks('tasting_vintage', 'YearPicker__value__2019');

			clickNext();

			clicks(
				'BoxSelectionOption_category_still',
				'BoxSelectionOption_nuance_white',
				'BoxSelectionOption_nuance_lemongreen',
				'BoxSelectionOption_clarity_clear',
				'BoxSelectionOption_colorintensity_deep',
				'selecting__condition_clean',
				'selecting__noseintensity_pronounced',
				'selecting__development_fullydeveloped'
			);

			clickNext(3);

			clicks(
				'selecting__sweetness_luscious',
				'selecting__acidity_high',
				'selecting__tannins_high',
				'selecting__alcohol_high',
				'selecting__body_full',
				'selecting__palateintensity_pronounced',
				'selecting__finish_long'
			);

			clickNext(3);

			clicks('selecting__quality_outstanding', 'selecting__readiness_tooyoung');

			clickNext(2);

			cy.get('[data-test=saveBtn] button').click({force: true});

			clicks('backToNewTasting', 'backToMyTastings');

			cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

			cy.contains(uniqueName);
		});

		it('Delete created profound tasting', function () {
			startFromMyTasting();

			cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

			cy.contains(uniqueName);

			click('deleteTasting', 1);
			click('DialogBox__yesBtn', 1);

			cy.contains(uniqueName).should('not.exist');
		});

		it('Changes aroma notes when switching wine color', function () {
			startFromNewTasting();

			click('selecting__profound');

			cy.get('[data-test=tasting_name]').type(uniqueName, {force: true});

			clicks('tasting_vintage', 'YearPicker__value__2020');

			clickNext();

			clicks(
				'BoxSelectionOption_category_still',
				'BoxSelectionOption_nuance_red',
				'BoxSelectionOption_nuance_garnet',
				'BoxSelectionOption_clarity_clear',
				'BoxSelectionOption_colorintensity_deep',
				'selecting__condition_clean',
				'selecting__noseintensity_pronounced',
				'selecting__development_fullydeveloped'
			);

			contains('Floral', 'Citrus fruit', 'Red fruit', 'Black fruit', 'Dried fruit', 'Cooked fruit');

			notContains('Green fruit', 'Stone fruit', 'Tropical fruit');

			clickBack(2);

			clicks(
				'BoxSelectionOption_nuance_white',
				'BoxSelectionOption_nuance_gold',
				'BoxSelectionOption_clarity_clear',
				'BoxSelectionOption_colorintensity_deep'
			);

			clickNext();

			contains(
				'Floral',
				'Green fruit',
				'Citrus fruit',
				'Stone fruit',
				'Tropical fruit',
				'Dried fruit',
				'Cooked fruit'
			);
		});
	});
}
