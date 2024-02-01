import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import SearchResultsListItem from './SearchResultsListItem';
import './SearchResultsList.scss';

const isSelected = (item, selectedItem) => selectedItem && selectedItem.name === item.name;

const makeRegex = (input) => new RegExp('((?:^|\\s)(?:' + input.split(' ').join('|') + '))', 'gi');

const createHighlighter = (input) => {
	const regex = makeRegex(input);
	const markStart = '<strong>';
	const markEnd = '</strong>';
	return (name) => markStart + name.replace(regex, markEnd + '$1' + markStart) + markEnd;
};

const SearchResultsList = ({items, selectedItem, highlightText, onSelect}) => {
	const highlightTextInput = createHighlighter(highlightText);
	const [currentSelectedItem, setSelected] = useState(null);

	// set selected item internally on mount
	useEffect(() => {
		setSelected(selectedItem);
	}, [selectedItem]);

	// update selected item internally and for the callback as well
	const handleSelect = (item) => {
		setSelected(item);
		onSelect(item);
	};

	return (
		<div className="SearchResultsList__Container">
			{items.map((item) => (
				<SearchResultsListItem
					key={item.name}
					name={highlightTextInput(item.name)}
					isSelected={isSelected(item, currentSelectedItem)}
					onClick={() => handleSelect(item)}
				/>
			))}
		</div>
	);
};

SearchResultsList.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string})),
	selectedItem: PropTypes.shape({name: PropTypes.string}),
	highlightText: PropTypes.string,
	onSelect: PropTypes.func,
};

SearchResultsList.defaultProps = {
	items: [],
	selectedItem: null,
	highlightText: '',
	onSelect: () => {},
};

export default SearchResultsList;
