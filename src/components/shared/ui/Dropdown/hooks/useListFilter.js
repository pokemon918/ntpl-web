import {useState} from 'react';

const useListFilter = (list, displayKey) => {
	const [filteredList, setFilteredList] = useState(list);

	const onChangeFilter = (value) => {
		const newFilter = list.filter((item) => item[displayKey] !== value);
		setFilteredList(newFilter);
	};

	return {onChangeFilter, filteredList};
};

export default useListFilter;
