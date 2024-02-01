import React from 'react';
import {connect} from 'react-redux';

import {getTotalRatingPoints} from 'commons/commons';
import BaseRatingTotal from 'components/shared/ui/RatingTotal';
import {ratingConstants} from 'const';

class TastingRatingTotal extends React.Component {
	getSelectedRatings() {
		const ratings = this.props.multiStepForm.selectedItems.rating
			? this.props.multiStepForm.selectedItems.rating
			: {};
		return ratings.final_points && ratings.final_points >= ratingConstants.BASE_POINTS
			? ratings.final_points
			: getTotalRatingPoints(ratings);
	}

	render() {
		return <BaseRatingTotal value={this.getSelectedRatings()} />;
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps)(TastingRatingTotal);
