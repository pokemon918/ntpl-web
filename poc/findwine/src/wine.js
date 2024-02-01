const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const ItemList = require('./autosuggest/ItemList');
const logger = require('./logger');

const WINEDATA_FILENAME = path.resolve(__dirname, '../data/winedata.csv');

const MAX_RESULTS = 100;

let wineData = [];
let wineList = null;
let wineSuggester = null;

function loadWineData() {
	return new Promise((resolve) => {
		fs.readFile(WINEDATA_FILENAME, (err, data) => {
			if (err) throw err;
			const csvText = data.toString();
			Papa.parse(csvText, {
				header: true,
				complete: (results) => {
					wineData = results.data;
					wineList = new ItemList(wineData);
					wineSuggester = wineList.getSuggester();
					resolve(wineData.length);
				},
			});
		});
	});
}

function searchWine(q) {
	if (!wineList || !wineSuggester) {
		return {suggestions: [], filteredItems: []};
	}

	wineList.setItemFilter(q);
	const {filteredItems} = wineList;

	const start = Date.now();
	const suggestions = wineSuggester.getSuggestions(q);
	const end = Date.now();
	const diff = (end - start) / 1000;
	logger.info(`searchWine text:"${q}" took ${diff}s`);

	const topResults = filteredItems.slice(0, MAX_RESULTS);

	return {suggestions, filteredItems: topResults};
}

module.exports = {loadWineData, searchWine};
