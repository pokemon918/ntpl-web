import Papa from 'papaparse';

import ItemList from './ItemList';
import wineDataUrl from './winedata.csv';

class LocalEngineAdapter {
	constructor(onSearchReady) {
		this.load(onSearchReady);
	}

	load(onSearchReady) {
		if (window.wineList) {
			return;
		}

		Papa.parse(wineDataUrl, {
			download: true,
			header: true,
			complete: (results) => {
				window.wineList = new ItemList(results.data);
				window.wineSuggester = window.wineList.getSuggester();

				if (onSearchReady) onSearchReady();
			},
		});
	}

	search(q) {
		if (!window.wineList || !window.wineSuggester) return [];

		window.wineList.setItemFilter(q);

		const {filteredItems} = window.wineList;
		const suggestions = window.wineSuggester.getSuggestions(q);

		return Promise.resolve({suggestions, filteredItems});
	}

	formatSuggestion(suggestion) {
		if (typeof suggestion !== 'string') {
			if (suggestion.data) {
				if (suggestion.data.NAME) {
					return suggestion.data.NAME;
				}
				return suggestion.data.toString();
			}
			return suggestion.toString();
		}
		return suggestion;
	}
}

export default LocalEngineAdapter;
