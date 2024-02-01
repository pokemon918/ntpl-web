import {
	startFromNewTasting,
	startFromMyTasting,
	uniqueName,
	clicks,
	click,
	clickNext,
} from '../../include';

export default function () {
	describe('Profound Tasting', function () {
		beforeEach(function () {
			cy.viewport('iphone-6');
			cy.restoreLoginState();
		});

		it('Login as default user', () => {
			cy.login();
		});

		it('Create a scholar 2 mobile tasting', function () {
			startFromNewTasting();

			clicks(
				'selecting__scholar2m',
				'selecting__colorintensity_deep',
				'selecting__type_white',
				'selecting__nuance_lemon',
				'selecting__noseintensity_pronounced'
			);

			clickNext(18);

			clicks(
				'selecting__sweetness_sweet',
				'selecting__acidity_high',
				'selecting__tannins_high',
				'selecting__alcohol_high',
				'selecting__body_full',
				'selecting__palateintensity_pronounced'
			);

			clickNext(18);

			clicks('selecting__finish_long', 'selecting__quality_outstanding');

			clickNext();

			cy.get('[data-test=tasting_name]').type(uniqueName, {
				force: true,
			});

			clicks('tasting_vintage', 'YearPicker__value__2017');

			cy.get('[data-test=saveBtn]').find('button.Button').click({force: true});

			clicks('backToNewTasting', 'backToMyTastings');

			cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

			cy.contains(uniqueName);
		});

		it('Delete created scholar 2 mobile tasting', function () {
			startFromMyTasting();

			cy.contains(uniqueName).first().parents('.WineList__Item').click({force: true});

			cy.contains(uniqueName);

			click('deleteTasting', 1);
			click('DialogBox__yesBtn', 1);

			cy.contains(uniqueName).should('not.exist');
		});
	});
}
