import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateSelectedItem} from 'actions/multiStepFormActions';
import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import {RatingBoard} from 'components/shared';
import {tastingTypesWithDetailedNotes} from './notes';

import rating from 'assets/json/tasting/rating.json';

class RatingStep extends Component {
	constructor(props) {
		super(props);
		this.initSelectedRatings = this.initSelectedRatings.bind(this);
	}

	componentDidMount() {
		document.getElementById('modal_body').scrollTop = 0;

		// Initialize selected ratings when it's not initialized or quality changed
		const selectedQuality = this.getSelectedQuality();
		const previousQuality = this.getPreviousQuality();
		if (
			this.props.multiStepForm.selectedItems.rating === undefined ||
			selectedQuality !== previousQuality
		) {
			this.initSelectedRatings();
		}
	}

	getRatingScore = {
		quality_outstanding: 0.45,
		quality_verygood: 0.33,
		quality_good: 0.3,
		quality_acceptable: 0.23,
		quality_poor: 0.13,
		quality_faulty: 0.07,
	};

	/*	getRatingScoreForSWA = {
		quality_outstanding: 0.85,
		quality_verygood: 0.55,
		quality_good: 0.4,
		quality_acceptable: 0.2,
		quality_poor: 0.1,
		quality_faulty: 0.0,
	};
	*/

	getRatingScoreForSWA = {
		quality_outstanding: 0.9,
		quality_verygood: 0.75,
		quality_good: 0.6,
		quality_acceptable: 0.4,
		quality_poor: 0.2,
		quality_faulty: 0.0,
	};

	getSelectedQuality = () => {
		const {multiStepForm = {}} = this.props;
		const selectedQuality =
			multiStepForm &&
			multiStepForm.selectedItems &&
			multiStepForm.selectedItems.observations &&
			multiStepForm.selectedItems.observations.quality__;
		return selectedQuality;
	};

	getPreviousQuality = () => {
		const {multiStepForm = {}} = this.props;
		const previousQuality =
			multiStepForm &&
			multiStepForm.selectedItems &&
			multiStepForm.selectedItems.rating &&
			multiStepForm.selectedItems.rating.previous_quality;
		return previousQuality;
	};

	// Populate and set default values to selectedRatings based on the default initial value
	initSelectedRatings() {
		const {multiStepForm = {}} = this.props;
		const selectedQuality = this.getSelectedQuality();
		const getRatingScoreData =
			multiStepForm?.tastingType === 'swa20' ? this.getRatingScoreForSWA : this.getRatingScore;
		const ratingValue = selectedQuality ? getRatingScoreData[selectedQuality] : 0.45;

		let ratingKey = rating.keys[0];
		let newSelectedRatings = {};
		let tastingSrc = multiStepForm.tastingSrc || [];

		// Set the default value for all rating fields
		tastingSrc[ratingKey] &&
			tastingSrc[ratingKey].forEach((ratingName, index) => {
				newSelectedRatings[ratingName] = ratingValue; // Set the default to 0.5 for all rating fields
				newSelectedRatings[ratingName + 'touched'] = null;
			});

		// Update reduxStore
		newSelectedRatings.previous_quality = selectedQuality;
		this.props.updateSelectedItem('rating', newSelectedRatings);
		return newSelectedRatings;
	}

	getSelectedRatings() {
		const selectedRatings = this.props.multiStepForm.selectedItems.rating
			? this.props.multiStepForm.selectedItems.rating
			: {};

		return selectedRatings;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.multiStepForm.selectedItems.rating === undefined) {
			this.initSelectedRatings();
			return false;
		}
		return true;
	}

	render() {
		const {
			showTitle,
			multiStepForm: {tastingType},
		} = this.props;

		let breadcrumb = '';
		breadcrumb = `tasting_observations / tasting_rating`;
		if (tastingTypesWithDetailedNotes.includes(tastingType)) {
			breadcrumb = `${tastingType}_ / tasting_observations / tasting_rating`;
		}

		return (
			<Grid columns={6}>
				<div className="step-container rating-step">
					<Modal.Title text={showTitle ? 'rating_your_rating' : 'shared_empty'} />
					<Modal.SubTitle text="shared_empty" />
					<Modal.Breadcrumb path={breadcrumb} />
					{tastingType === 'swa20' && (
						<>
							<div className="Rating__Vertical__Column1" />
							<div className="Rating__Vertical__Column2" />
						</>
					)}
					<RatingBoard ratings={this.getSelectedRatings()} />
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {updateSelectedItem})(RatingStep);
