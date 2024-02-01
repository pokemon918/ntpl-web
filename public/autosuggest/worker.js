// Web Worker

self.importScripts('/autosuggest/lodash.custom.min.js');
self.importScripts('/autosuggest/papaparse.min.js');
self.importScripts('/autosuggest/autosuggest.js');
self.importScripts('/autosuggest/ItemList.js');

self.addEventListener('message', processEvent);

function processEvent(event) {
	const {type, payload} = event.data;
	const eventTypes = {
		search,
	};
	if (!type || !eventTypes[type]) return;
	eventTypes[type](payload);
}

function normalizeSearch(search) {
	if (typeof search === 'object') {
		return search.data ? search.data.NAME : search.toString();
	}
	return search;
}

function search(payload) {
	const {time, q} = payload;
	const search = normalizeSearch(q);

	if (!self.wineList || !self.wineSuggester) return [];

	self.wineList.setItemFilter(search);

	const {filteredItems} = self.wineList;
	const suggestions = self.wineSuggester.getSuggestions(normalizeSearch(search));

	const results = {suggestions, filteredItems};
	self.postMessage({
		type: 'search',
		payload: {time, q: search, results},
	});
	return results;
}

// Load data of CSV file

Papa.parse('/autosuggest/winedata.csv', {
	skipEmptyLines: true,
	download: true,
	header: true,
	complete: (results) => {
		if (results.errors && results.errors.length) {
			self.postMessage({
				type: 'error',
				payload: results.errors
			});
			return;
		}

		self.wineList = new ItemList(results.data);
		self.wineSuggester = self.wineList.getSuggester();

		self.postMessage({
			type: 'ready',
		});
	},
});
