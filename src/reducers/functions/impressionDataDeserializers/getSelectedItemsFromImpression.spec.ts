import {getSelectedItemsFromImpression} from './index';

import impressionData from './fixtures/impressionData.json';
import expectedSelectedItems from './fixtures/expectedSelectedItems.json';

describe('getSelectedItemsFromImpression', () => {
	it('Should convert selected items from impression data', () => {
		const selectedItems = getSelectedItemsFromImpression(impressionData);
		expect(selectedItems).toEqual(expectedSelectedItems);
	});

	it('Should convert selected medal', () => {
		const medalFixture = {
			info: {
				medal: 'gold',
			},
		};
		const selectedItems = getSelectedItemsFromImpression(<any>medalFixture);
		expect(selectedItems.medal.selectedMedal).toBe('medal_gold');
	});

	it('Should convert selected recommendation', () => {
		const recommendationFixture = {
			info: {
				recommendation: 'commended',
			},
		};
		const selectedItems = getSelectedItemsFromImpression(<any>recommendationFixture);
		expect(selectedItems.medal.selectedMedal).toBe('recommendation_commended');
	});

	it('Should support SWA round 1 events', () => {
		const round1Fixture = {
			info: {
				recommendation: 'commended',
			},
			metadata: {
				swa_round_2: false,
			},
		};
		const selectedItems = getSelectedItemsFromImpression(<any>round1Fixture);
		expect(selectedItems.event.swa_round_2).toBe(false);
		expect(selectedItems.metadata.medal_page).toBe(false);
	});

	it('Should support SWA round 2 events', () => {
		const round2Fixture = {
			info: {
				medal: 'gold',
			},
			metadata: {
				swa_round_2: true,
			},
		};
		const selectedItems = getSelectedItemsFromImpression(<any>round2Fixture);
		expect(selectedItems.event.swa_round_2).toBe(true);
		expect(selectedItems.metadata.medal_page).toBe(true);
	});
});
