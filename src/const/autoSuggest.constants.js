import orderBy from 'lodash/orderBy';

import countryRank from 'assets/json/countryRank.json';
import regions from 'assets/json/regions.json';
import grapes from 'assets/json/grapes.json';

const autoSuggestConstants = {
	tasting_country: {
		valueKey: 'id',
		displayKey: 'name',
		items: orderBy(countryRank, ['rank'], ['desc']),
		afterChange: (item, infoData, callbacks) => {
			if (infoData.tasting_region_key) {
				const {updateSelectedInfo, cleanup} = callbacks;
				updateSelectedInfo({
					tasting_region: '',
					tasting_region_key: '',
				});
				if (typeof cleanup.tasting_region === 'function') {
					window.requestAnimationFrame(() => {
						cleanup.tasting_region();
					});
				}
			}
		},
	},
	tasting_region: {
		valueKey: 'key',
		displayKey: 'name',
		enableFreeText: true,
		items: orderBy(regions, ['name'], ['asc']),
		filter: (items, infoData) => {
			const selectedCountryCode = infoData.tasting_country_key;
			if (selectedCountryCode) {
				return items.filter((i) => i.country === selectedCountryCode);
			}
			return items;
		},
		afterChange: (item, infoData, callbacks) => {
			const {updateSelectedInfo} = callbacks;
			if (item && item.country) {
				updateSelectedInfo({tasting_country_key: item.country});
			}
		},
	},
	tasting_grape: {
		valueKey: 'name',
		displayKey: 'name',
		enableFreeText: true,
		type: 'multi',
		items: orderBy(grapes, ['desc']),
	},
};

export default autoSuggestConstants;
