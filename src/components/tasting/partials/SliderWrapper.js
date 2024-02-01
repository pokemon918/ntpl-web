import React, {Component} from 'react';

import Slider from 'components/shared/ui/Slider';

class SliderWrapper extends Component {
	state = {
		ratingCount: 10,
	};

	componentDidMount() {
		const {ratingName, rating = {}} = this.props;

		if (ratingName && rating[ratingName]) {
			const value = this.getOriginalValue(rating[ratingName]);

			this.setState({ratingCount: value});
		}
	}

	getOriginalValue = (finalValue) => {
		let rawValue = finalValue * 100;
		let originalValue = (rawValue * this.props.max) / 100;

		return originalValue;
	};

	onUpdateSlider = (value) => {
		const {ratingName} = this.props;

		this.setState({ratingCount: value});
		this.props.handleRatingSelect(ratingName, value);
	};

	render() {
		const {id, max, ratingName, rating} = this.props;
		const {ratingCount} = this.state;

		return (
			<Slider
				innerRefIndex={id}
				id={ratingName}
				title={ratingName}
				minimum={0}
				maximum={max}
				current={ratingCount}
				onChange={this.onUpdateSlider}
				initialValueChanged={rating[ratingName + 'touched']}
			/>
		);
	}
}

export default SliderWrapper;
