import React, {Component} from 'react';
import L18nText from 'components/shared/L18nText';

import {ratingConstants} from 'const';
import {getTotalRatingPoints} from 'commons/commons';
import './RatingTotal.scss';

export default class RatingTotal extends Component {
	render() {
		const label = this.props.showLabel ? (
			<p className="rp-label">
				<L18nText id="shared_rating_points" defaultMessage="Points" />
			</p>
		) : null;

		const totalPoints =
			this.props.ratings.final_points &&
			this.props.ratings.final_points >= ratingConstants.BASE_POINTS
				? this.props.ratings.final_points
				: getTotalRatingPoints(this.props.ratings);
		return (
			<div className="rating-total">
				<h2 className="rp-digits">{totalPoints}</h2>
				{label}
			</div>
		);
	}
}

RatingTotal.defaultProps = {
	showLabel: true,
	basePoints: ratingConstants.BASE_POINTS,
	max: ratingConstants.MAX,
};
