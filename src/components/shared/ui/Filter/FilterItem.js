import React from 'react';
import PropTypes from 'prop-types';

import './FilterItem.scss';

const FilterItem = ({onClick, children, selected}) => (
	<div
		className={`FilterItem__Default ${selected ? 'FilterItem__Selected' : ''}`}
		onClick={onClick}
	>
		{children}
		<span>X</span>
	</div>
);

FilterItem.propTypes = {
	children: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
};

export default FilterItem;
