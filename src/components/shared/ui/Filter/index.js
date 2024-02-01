import React from 'react';
import PropTypes, {shape} from 'prop-types';
import FilterItem from './FilterItem';
import './Filter.scss';

const Filter = ({items, selected, onSelect}) => (
	<div className="FiltersContainer">
		{items.map((item, key) => (
			<FilterItem
				key={key}
				children={item.description}
				selected={selected && selected.description === item.description}
				onClick={() => onSelect(item)}
			/>
		))}
	</div>
);

Filter.propTypes = {
	items: PropTypes.arrayOf(shape({description: PropTypes.string})),
	selected: shape({name: PropTypes.string}),
	onSelect: PropTypes.func,
};

Filter.propTypes = {
	onSelect: () => {},
};

export default Filter;
