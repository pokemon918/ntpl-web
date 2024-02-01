import React from 'react';
import PropTypes from 'prop-types';

import TastingOverviewMenuItem from './TastingOverviewMenuItem';
import './TastingOverviewMenu.scss';

import {ReactComponent as IconAppearance} from './Icon_Appearance.svg';
import {ReactComponent as IconObservation} from './Icon_Observation.svg';
import {ReactComponent as IconRating} from './Icon_Rating.svg';

const listItems = [
	{
		icon: <IconAppearance />,
		label: 'Appearance',
	},
	{
		label: 'Nose',
	},
	{
		label: 'Palate',
	},
	{
		icon: <IconObservation />,
		label: 'Observation',
	},
	{
		icon: <IconRating />,
		label: 'Rating',
	},
];

const TastingOverviewMenu = ({onClose, onSelectItem}) => {
	return (
		<div className="TastingOverviewMenu__Container">
			<div className="closebtn" onClick={onClose}>
				&times;
			</div>
			<div className="TastingOverviewMenu__Header">
				<h1>Profound Tasting</h1>
			</div>

			<ul className="TastingOverviewMenu__List">
				{listItems.map((item, i) => {
					return (
						<TastingOverviewMenuItem
							key={i}
							icon={item.icon}
							label={item.label}
							onSelectItem={() => onSelectItem(item.label)}
						/>
					);
				})}
			</ul>
		</div>
	);
};

TastingOverviewMenu.propTypes = {
	onClose: PropTypes.func,
	onSelectItem: PropTypes.func,
};

export default TastingOverviewMenu;
