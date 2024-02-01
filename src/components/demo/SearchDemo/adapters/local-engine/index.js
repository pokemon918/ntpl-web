import Papa from 'papaparse';

import wineDataUrl from 'assets/csv/winedata.csv';

import ItemList from './ItemList';

class LocalEngineAdapter {
	constructor(onSearchReady, onSearchError) {
		this.load(onSearchReady, onSearchError);
	}

	load(onSearchReady, onSearchError) {
		if (window.wineList) {
			return;
		}

		Papa.parse(wineDataUrl, {
			download: true,
			header: true,
			complete: (results) => {
				if (results.errors && results.errors.length) {
					onSearchError(results.errors);
					return;
				}

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

		const results = {suggestions, filteredItems};
		return results;
	}
}

export default LocalEngineAdapter;
