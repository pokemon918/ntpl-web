import React from 'react';
import PropTypes from 'prop-types';
import {ReactComponent as IconChevronRight} from './Icon_ChevronRight.svg';

const TastingOverviewMenuItem = ({icon = false, label = '', onSelectItem}) => (
	<li className="TastingOverviewMenu__ListItem" onClick={onSelectItem}>
		<i className="list-icon">{icon}</i>
		{label && <span className="label">{label}</span>}
		<div className="LevelDownBtn_Container">
			<button className="level-down-btn">
				<IconChevronRight />
			</button>
		</div>
	</li>
);

TastingOverviewMenuItem.propTypes = {
	icon: PropTypes.element,
	label: PropTypes.string,
	onSelectItem: PropTypes.func,
};

export default TastingOverviewMenuItem;
