import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './SearchResultsListItem.scss';

const SearchResultsListItem = ({name, isSelected, onClick}) => (
	<div
		className={classNames('SearchResultsListItem__Container', {isSelected})}
		onClick={onClick}
		dangerouslySetInnerHTML={{__html: name}}
	/>
);

SearchResultsListItem.propTypes = {
	name: PropTypes.string,
	isSelected: PropTypes.bool,
	onClick: PropTypes.func,
};

export default SearchResultsListItem;
