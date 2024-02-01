import React, {Component} from 'react';

import RatingList from './RatingList';

import './RatingBoard.scss';

export default class RatingBoard extends Component {
	render() {
		const {ratings, disableRating} = this.props;

		return (
			<div className="rating-board">
				<RatingList ratings={ratings} disableRating={disableRating} />
			</div>
		);
	}
}

RatingBoard.defaultProps = {
	disableRating: false,
};
