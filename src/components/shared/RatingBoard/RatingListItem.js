import React, {Component} from 'react';

import Slider from '../ui/Slider';

export default class RatingListItem extends Component {
	render() {
		const {ratingName, ratingKey, initialVal, max, ratingAlreadySet, innerRefIndex} = this.props;

		return (
			<li>
				<Slider
					title={ratingName}
					id={ratingName}
					minimum={0}
					maximum={max}
					current={initialVal}
					onChange={(value) => {
						this.props.handleRatingSelect(ratingKey, ratingName, value);
					}}
					innerRefIndex={innerRefIndex}
					initialValueChanged={ratingAlreadySet}
					disabled={this.props.disableRating}
				/>
			</li>
		);
	}
}
