import * as React from 'react';
import {FC, useMemo, useState} from 'react';

import SearchBar from '../SearchBar';

interface Props {
	/**
	 * Wraps search bar with custom styles
	 */
	className?: string;

	/**
	 * Placeholder of the search input
	 */
	placeholder: string;

	/**
	 * Input data to be filtered
	 */
	data: any[];

	/**
	 * Function used to filter each item
	 */
	filter: (item: any, normalize: (str: string) => string, search: string) => boolean;
}

const lowerCase = (str: string) => str?.toLowerCase() ?? '';

const SearchData: FC<Props> = (props) => {
	const {className, placeholder, data, filter, children} = props;

	const [search, setSearch] = useState('');

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		if (!search) return data;
		return data.filter((item) => filter(item, lowerCase, search));
	}, [data, filter, search]);

	return (
		<>
			<div className={className}>
				<SearchBar
					placeholder={placeholder}
					onHandleChange={(search) => setSearch(lowerCase(search))}
				/>
			</div>
			{typeof children === 'function' && children({filteredData})}
		</>
	);
};

export default SearchData;
