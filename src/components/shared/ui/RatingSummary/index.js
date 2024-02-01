import React from 'react';
import PropTypes from 'prop-types';
import L18nText from 'components/shared/L18nText';

import BaseSummary from '../BaseSummary';

import './RatingSummary.scss';

const RatingSummary = ({ratings, score, hideHeader = false, hideScore = false}) => (
	<div className="RatingSummary__Container">
		<div className="RatingSummary__Heading">
			{!hideHeader && (
				<>
					<header>
						<L18nText id="rating_your_rating" defaultMessage="Your rating" />
					</header>
					{hideScore && (
						<>
							<span className="RatingSummary__Points">{score}</span>
							<L18nText id="rating_points" defaultMessage="Points" />
						</>
					)}
				</>
			)}
		</div>
		<BaseSummary type="percent" items={ratings} steps={1} rounded />
	</div>
);

RatingSummary.propTypes = {
	ratings: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			value: PropTypes.number,
		})
	),
	score: PropTypes.number,
};

RatingSummary.defaultProps = {
	score: 0,
};

export default RatingSummary;
