import React from 'react';
import PropTypes from 'prop-types';

import {ReactComponent as ClockIcon} from './clock.svg';
import './TastingTypeCard.scss';

const TastingTypeCard = ({name, requiredMinutes}) => (
	<div className="TastingTypeCard__Wrapper">
		<div className="header">
			<span>{name}</span>
		</div>
		<div className="footer">
			<div className="icon">
				<ClockIcon />
			</div>
			<span>Required time: {requiredMinutes} minutes</span>
		</div>
	</div>
);

TastingTypeCard.propTypes = {
	name: PropTypes.string,
	requiredMinutes: PropTypes.string,
};

export default TastingTypeCard;
