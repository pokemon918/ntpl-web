import {useState} from 'react';

const MAX_SUGGESTIONS = 4;

const useListFilter = (list, getText, enableFreeText, afterChangeFilter, type = 'single') => {
	const [search, setSearch] = useState('');
	const [filteredList, setFilteredList] = useState([]);

	const onChangeFilter = (newFilter) => {
		let matchesFilter = null;

		if (type === 'single') {
			matchesFilter = (text) =>
				!!newFilter && text.toLowerCase().startsWith(newFilter.toLowerCase());
		}

		if (type === 'multi') {
			const searchedText = newFilter.split(' ')[newFilter.split(' ').length - 1];
			matchesFilter = (text) =>
				!!searchedText && !!newFilter && text.toLowerCase().startsWith(searchedText.toLowerCase());
		}

		const matchesInput = (each) => matchesFilter(getText(each));
		const newFilteredList = list.filter(matchesInput).slice(0, MAX_SUGGESTIONS);
		setFilteredList(newFilteredList);
		setSearch(newFilter.trimStart());
		afterChangeFilter(newFilter);
	};

	const clearSearch = () => {
		setFilteredList([]);

		// no free text means that the input must be cleared if no suggestion was selected
		if (!enableFreeText) {
			setSearch('');
		}
	};

	return {search, clearSearch, filteredList, onChangeFilter};
};

export default useListFilter;
