const {IncrementalAutosuggest: Autosuggest} = require('./autosuggest');

const MAX_SUGGESTIONS = 10;

function itemContains(item, str) {
	for (let prop in item) {
		let propValue = item[prop];
		if (propValue.toLowerCase().indexOf(str) !== -1) return true;
	}
	return false;
}

class ItemList {
	constructor(allItems) {
		this.allItems = allItems;
		this.filteredItems = allItems;
		this.itemFilter = '';
	}

	setItemFilter(itemFilter) {
		this.itemFilter = itemFilter;
		this.filteredItems = this.getFilteredItems(itemFilter);
	}

	getFilteredItems(itemFilter) {
		let allItems = this.allItems;
		if (itemFilter === '') return allItems;

		let words = itemFilter.toLowerCase().split(' ');
		return allItems.filter(function (item) {
			for (var w of words) {
				if (!itemContains(item, w)) return false;
			}
			return true;
		});
	}

	getSuggester() {
		const items = this.allItems.map((i) => ({data: i}));
		return new Autosuggest(items, MAX_SUGGESTIONS);
	}
}

module.exports = ItemList;
