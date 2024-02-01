import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {ReactComponent as FortifiedIcon} from './icon-wine-fortified.svg';
import {ReactComponent as SparklingIcon} from './icon-wine-sparkling.svg';
import {ReactComponent as StillIcon} from './icon-wine-still.svg';
import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';

import './ListSelectionItem.scss';

const selectedIcon = {
	winetype_still_: <StillIcon />,
	category_fortified: <FortifiedIcon />,
	winetype_sparkling_: <SparklingIcon />,
};

const selectedColor = {
	nuance_red: '#c83232',
	nuance_orange: '#f86f57',
	nuance_rose: '#ffaa96',
	nuance_white: '#f0ffb4',
	type_rose: '#ffaa96',
	type_red: '#c83232',
	type_white: '#f0ffb4',
};

const getColorComponent = (id) => {
	return (
		<div
			className="SelectionButton__Context__WineColor"
			style={{backgroundColor: selectedColor[id]}}
		/>
	);
};

const getWineTypeComponent = (id) => {
	return <div className="SelectionButton__Context__WineType">{selectedIcon[id]}</div>;
};

const ListSelectionItem = ({id, name, type, isActive, onSelect}) => {
	const contextBtnClass = classnames('SelectionButton__Context', {
		active: isActive,
	});

	return (
		<div className={contextBtnClass} onClick={onSelect}>
			{type === 'color' && getColorComponent(id)}
			{type === 'wineType' && getWineTypeComponent(id)}
			<div className="SelectionButton__Context__Text">{name}</div>
			<div className="SelectionButton__Context__Chevron">
				<ChevronIcon />
			</div>
		</div>
	);
};

ListSelectionItem.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	isActive: PropTypes.bool,
	onSelect: PropTypes.func,
	type: PropTypes.oneOf(['default', 'wineType', 'color']),
};

export default ListSelectionItem;
