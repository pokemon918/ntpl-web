import React from 'react';
import PropTypes from 'prop-types';

import './StarRating.scss';
import classnames from 'classnames';
import StarRatingIcon from './StarRatingIcon';

// Number of stars to be shown
const starRatingCounts = [1, 2, 3, 4, 5];

class StarRating extends React.Component {
	state = {
		rating: 0,
	};

	componentDidMount() {
		this.setState({rating: this.props.rating});
	}

	onChange = (key) => {
		this.setState({rating: 0});

		if (key === this.state.rating) {
			// Reset rating value if clicked on current rating.
			this.setState({rating: 0});

			return this.props.onHandleClick(0);
		}

		this.setState({rating: key});
		this.props.onHandleClick(key);
	};

	render() {
		const {rating} = this.state;
		const {readOnly} = this.props;

		const starContainerClass = classnames('StarRating_Container', {
			viewMode: readOnly,
		});

		return (
			<div className="StarRating_Wrapper">
				<div className={starContainerClass}>
					{starRatingCounts.map((key) => {
						const isCurrentItemActive = key <= rating;
						const makeTitle = (stars) => (stars === 1 ? '1 star' : `${stars} stars`);

						const ratingItemClass = classnames('StarRating_Item', {
							active: isCurrentItemActive,
							viewMode: readOnly,
						});

						return readOnly ? (
							<span key={key} className={ratingItemClass}>
								<StarRatingIcon />
							</span>
						) : (
							<span
								key={key}
								className={ratingItemClass}
								title={makeTitle(key)}
								onClick={() => this.onChange(key)}
							>
								<StarRatingIcon />
							</span>
						);
					})}
				</div>
			</div>
		);
	}
}

StarRating.propTypes = {
	rating: PropTypes.number,
	readOnly: PropTypes.bool,
	onHandleClick: PropTypes.func,
};

export default StarRating;
