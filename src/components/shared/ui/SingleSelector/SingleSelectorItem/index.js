import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import L18nText from 'components/shared/L18nText';

import Event from './event.png';
import {ReactComponent as FortifiedIcon} from './icon-wine-fortified.svg';
import {ReactComponent as SparklingIcon} from './icon-wine-sparkling.svg';
import {ReactComponent as StillIcon} from './icon-wine-still.svg';
import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';
import {selectedColor} from './options.js';

import './SingleSelectorItem.scss';

const selectedIcon = {
	category_still: <StillIcon />,
	type_sherry_: <FortifiedIcon />,
	category_fortified: <FortifiedIcon />,
	type_port: <FortifiedIcon />,
	category_sparkling: <SparklingIcon />,
};

const getColorComponent = (id, colors = '', activeColor, key) => {
	let backgroundColor = '';
	let background = '';

	if (key === 'clarity__' || key === 'colorintensity__') {
		backgroundColor = selectedColor[id][activeColor];
		background = selectedColor[id][activeColor];
	} else {
		backgroundColor = colors[id] || selectedColor[id] || selectedColor[activeColor];
		background = selectedColor[activeColor];
	}
	const border = backgroundColor === 'transparent' ? '2px solid #391d4d' : null;

	return (
		<div
			className="SelectionButton__Context__WineColor"
			style={{
				background,
				backgroundColor,
				border,
			}}
		/>
	);
};

const getWineTypeComponent = (id) => {
	return <div className="SelectionButton__Context__WineType">{selectedIcon[id]}</div>;
};

const SelectionButtonWithDescription = ({
	name,
	description,
	subHeader,
	shortSubHeaderOnMobile,
	hideDescription,
}) => {
	return (
		<>
			<div
				className={classnames('SelectionButton__Context__HeadingWrapper', {
					shortSubHeaderOnMobile,
				})}
			>
				<div className="SelectionButton__Context__Text">{name}</div>
				{subHeader && (
					<div className="SelectionButton__Context_SubHeader">
						<L18nText id={subHeader} />
					</div>
				)}
			</div>
			<div className="SelectionButton__Context__Description">
				<L18nText id={description} />
			</div>
		</>
	);
};

const SingleSelectorItem = ({
	id,
	name,
	type,
	colors,
	subTitle,
	className,
	disabled,
	isActive,
	hideDescription,
	activeSelection,
	onSelect,
	hideArrow,
	activeColor,
	subHeader,
	description,
	shortSubHeaderOnMobile,
}) => {
	const contextBtnClass = classnames('SelectionButton__Context', [className], {
		active: isActive,
		looksDisabled: disabled,
	});

	const dataTestValue = `selecting__${id}`;

	return (
		<div
			className={contextBtnClass}
			onClick={onSelect}
			data-test={dataTestValue}
			data-testid={dataTestValue}
		>
			{type === 'color' &&
				getColorComponent(id, colors, activeColor, activeSelection && activeSelection.key)}
			{type === 'winetype' && getWineTypeComponent(id)}
			{type === 'event' && <img src={Event} alt="logo" />}
			<div className="SelectionButton__Description__Wrapper">
				{!hideDescription && description ? (
					<SelectionButtonWithDescription
						name={name}
						description={description}
						subHeader={subHeader}
						shortSubHeaderOnMobile={shortSubHeaderOnMobile}
					/>
				) : (
					<>
						<div className="SelectionButton__Context__Text">{name}</div>
						{subTitle && <div className="SelectionButton__Context__Sub_Text">{subTitle}</div>}
					</>
				)}
			</div>
			{!hideArrow && (
				<div className="SelectionButton__Context__Chevron">
					<ChevronIcon />
				</div>
			)}
		</div>
	);
};

SingleSelectorItem.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	isActive: PropTypes.bool,
	onSelect: PropTypes.func,
	hideArrow: PropTypes.bool,
	type: PropTypes.oneOf(['default', 'winetype', 'color', 'event']),
	colors: PropTypes.objectOf(PropTypes.string),
	className: PropTypes.string,
	shortSubHeaderOnMobile: PropTypes.bool,
};

export default SingleSelectorItem;
