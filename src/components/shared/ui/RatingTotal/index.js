import React from 'react';
import PropTypes from 'prop-types';

import L18nText from 'components/shared/L18nText';

import './RatingTotal.scss';

const RatingTotal = ({value}) => (
	<div className="RatingTotal_Container">
		<span>{value | 0}</span>
		<div className="RatingTotal__SubHeader">
			<L18nText id={'rating_subHeader'} defaultMessage={'Tweak your rating'} />
		</div>
	</div>
);

RatingTotal.propTypes = {
	value: PropTypes.number.isRequired,
};

export default RatingTotal;
