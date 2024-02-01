import React, {Component} from 'react';
import {connect} from 'react-redux';

import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import Price from 'components/shared/ui/Price';
import TextArea from 'components/shared/ui/TextArea';
import TextInput from 'components/shared/ui/TextInput';
import {SliderWrapper} from 'components/tasting/partials';
import {updateSelectedItem} from 'actions/multiStepFormActions';
import {tastingTypesWithDetailedNotes} from './notes';
import {ratingConstants} from 'const';
import L18nText from 'components/shared/L18nText';

import './PersonalNoteStep.scss';

export const currencies = [
	{id: 1, description: 'European Dollar', key: 'app_currency_eur'},
	{id: 2, description: 'US Dollar', key: 'app_currency_usd'},
	{id: 3, description: 'GBP', key: 'app_currency_gbp'},
	{id: 4, description: 'Japan', key: 'app_currency_yen'},
	{id: 5, description: 'Danish', key: 'app_currency_dkk'},
];

const ratings = ['rating_drinkability_', 'rating_maturity_'];

class PersonalNoteStep extends Component {
	componentDidMount() {
		this.initSelectedRatings();
		document.getElementById('modal_body').scrollTop = 0;
	}

	getPageRatings = () => this.props.customRatings || ratings;

	updateComments = (value) => {
		const {tastingType} = this.props.multiStepForm;

		if (tastingType === 'quick') {
			this.props.updateSelectedItem('comments', {tastingNote: value});
		} else {
			this.props.updateSelectedItem('comments', {wine_personal: value});
		}

		this.props.revalidateForm();
	};

	updateFoodPairing = (value) => {
		this.props.updateSelectedItem('comments', {food_pairing: value});
		this.props.revalidateForm();
	};

	updatePrice = ({currency, price}) => {
		this.props.updateSelectedItem('info', {tasting_currency: currency});
		this.props.updateSelectedItem('info', {tasting_price: price});
	};

	updateLocation = (location) => {
		this.props.updateSelectedItem('comments', {personal_location: location});
		this.props.revalidateForm();
	};

	getFinalValue(value) {
		let percentageValue = 100 / (this.props.max / value);
		let finalValue = percentageValue / 100;

		return finalValue;
	}

	handleRatingSelect = (ratingName, value) => {
		// update redux store
		return this.props.updateSelectedItem('comments', {
			[ratingName]: this.getFinalValue(value),
			[ratingName + 'touched']: true,
		});
	};

	initSelectedRatings = () => {
		const {
			multiStepForm: {
				selectedItems: {comments},
			},
		} = this.props;

		const ratingValue = 0.45;

		// Set the default value for all rating fields
		this.getPageRatings().forEach((key) => {
			return this.props.updateSelectedItem('comments', {
				[key]: (comments && comments[key]) || ratingValue,
			});
		});
	};

	render() {
		const {customTitle, customSubTitle, hideLocationAndPrice, displayFoodPairing} = this.props;

		const {
			selectedItems: {info = {}, comments = {}},
			tastingType,
		} = this.props.multiStepForm;
		const {initState} = this.props;
		const disabledLocation =
			initState && initState.comments
				? initState.comments.hasOwnProperty('personal_location')
				: false;
		const disabledPrice =
			initState && initState.info ? initState.info.hasOwnProperty('tasting_price') : false;
		const disabledCurrency =
			initState && initState.info ? initState.info.hasOwnProperty('tasting_price') : false;

		const placeholder =
			tastingType === 'quick'
				? 'tasting_note_textarea_placeholder'
				: 'personal_note_textarea_placeholder';
		const gridColumns = tastingType === 'swa20' ? 6 : 4;

		const pageTitle = customTitle || 'tasting_personal_notes';
		const pageSubTitle = customSubTitle || 'shared_empty';

		let breadcrumb = '';

		breadcrumb = `tasting_observations / ${pageTitle}`;
		if (tastingTypesWithDetailedNotes.includes(tastingType)) {
			breadcrumb = `${tastingType}_ / tasting_observations / ${pageTitle}`;
		}

		return (
			<Grid columns={gridColumns}>
				<div className="PersonalNote__Wrapper">
					<Modal.Breadcrumb path={breadcrumb} />
					<Modal.Title text={pageTitle} />
					<Modal.SubTitle text={pageSubTitle} />
					<TextArea
						placeholder={placeholder}
						onChange={(e) => this.updateComments(e.target.value)}
						value={tastingType === 'quick' ? comments.tastingNote : comments.wine_personal}
						infoKey={'tasting_personal_note_description'}
					/>
					{!hideLocationAndPrice && (
						<div className="PersonalNote__Item">
							<TextInput
								label="app_location"
								type="text"
								infoKey={'tasting_location'}
								onChange={this.updateLocation}
								value={comments.personal_location || ''}
								disabled={disabledLocation}
							/>
							<Price
								currencies={currencies}
								onHandleSelect={this.updatePrice}
								initialPrice={info && info.tasting_price}
								initialCurrency={info && info.tasting_currency}
								disabledPrice={disabledPrice}
								disabledCurrency={disabledCurrency}
							/>
						</div>
					)}
					{displayFoodPairing && (
						<div className="PersonalNote_Item">
							<div className="PersonalNote_Wrapper">
								<L18nText id="tasting_food_pairing" />
							</div>

							<h2>
								<L18nText id="tasting_food_pairing_question" />
							</h2>
							<TextArea
								placeholder="tasting_food_pairing_placeholder"
								onChange={(e) => this.updateFoodPairing(e.target.value)}
								value={comments.food_pairing}
								infoKey="tasting_food_pairing_question"
							/>
						</div>
					)}
					<div className="SlideWrapper__Container">
						{this.getPageRatings().map((item, index) => (
							<SliderWrapper
								id={index}
								key={index}
								rating={comments}
								max={this.props.max}
								ratingName={item}
								handleRatingSelect={this.handleRatingSelect}
							/>
						))}
					</div>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	const {
		app,
		multiStepForm,
		offline: {online},
	} = state;

	return {
		app,
		multiStepForm,
		online,
	};
}

PersonalNoteStep.defaultProps = {
	initial: ratingConstants.INITIAL,
	max: ratingConstants.MAX,
};

export default connect(mapStateToProps, {updateSelectedItem})(PersonalNoteStep);
