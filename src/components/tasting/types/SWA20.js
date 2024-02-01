import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router';
import {injectIntl} from 'react-intl';
import L18nText from 'components/shared/L18nText';

import {updateSelectedItem, submitForm, navigateForm} from 'actions/multiStepFormActions';
import info from 'assets/json/tasting/info.json';
import {getCurrency} from 'commons/commons';

import {getSelectedEventMetadata} from 'reducers/selectedEventReducer';

import MultiStepForm from '../MultiStepForm';
import {PersonalNoteStep, FormStep, InfoStep, RatingStep, MedalStep} from '../steps';
import getTastingSetup from '../setup/swa20';

import 'assets/scss/shared/make-tasting-page.scss';
import {routeConstants, tastingsConstants} from 'const';

class SWA20 extends Component {
	constructor(props) {
		super(props);
		this.initState = props.event ? props.multiStepForm.selectedItems : null;
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}

	componentDidMount() {
		this.copyFieldsFromMoldTasting();
		this.props.navigateForm(1);
	}

	isEditing = () => {
		const {path} = this.props.match || {};
		const isEditing = path === routeConstants.EDIT_TASTING;
		return isEditing;
	};

	copyFieldsFromMoldTasting = () => {
		if (this.isEditing()) {
			return;
		}

		this.saveWineAppearance();
		this.saveEventMetadata();
	};

	saveWineAppearance = () => {
		const {eventTastingData} = this.props;
		if (!eventTastingData || !eventTastingData.notes) {
			return;
		}

		const originalNotes = eventTastingData.notes['@'] || [];
		const wineType = originalNotes.find(
			(note) => note.startsWith('category_') || note.startsWith('type_')
		);
		const wineColor = originalNotes.find(
			(note) => note.startsWith('nuance_') || note.startsWith('color_')
		);

		this.props.updateSelectedItem('appearance', {
			winetype_: wineType,
			color_: wineColor,
		});
	};

	saveEventMetadata = () => {
		const {eventMetadata} = this.props;
		const isRound2 = eventMetadata && eventMetadata.swa_round_2;
		this.props.updateSelectedItem('event', {swa_round_2: isRound2});
	};

	async handleFormSubmission() {
		const {
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		const result = await this.props.submitForm(
			this.props.multiStepForm.selectedItems,
			online,
			tastingsConstants.SWA20,
			this.props.history
		);

		if (result) {
			const {event} = this.props;
			const redirectUrl = routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	getEventInfo = () => {
		if (!this.isEditing()) {
			const {event: eventRef, eventTastingData, eventMetadata} = this.props;

			const originalNotes = eventTastingData?.notes['@'] || [];
			const wineType = originalNotes.find(
				(note) => note.startsWith('category_') || note.startsWith('type_')
			);
			const wineColor = originalNotes.find(
				(note) => note.startsWith('nuance_') || note.startsWith('color_')
			);

			const {name, price, currency, vintage, region} = eventTastingData;

			const hasMedalSetting = eventMetadata?.medal_page;
			const isRound2 = eventMetadata?.swa_round_2;

			return {
				eventRef,
				wineType,
				wineColor,
				name,
				region,
				price,
				currency,
				vintage,
				hasMedalSetting,
				isRound2,
			};
		}

		const {multiStepForm} = this.props;
		const {selectedItems = {}} = multiStepForm;
		const {appearance = {}, info = {}, collection = {}, event = {}, metadata = {}} = selectedItems;
		const {id: eventRef} = collection;

		const wineType = appearance.winetype_;
		const wineColor = appearance.color_;
		const name = info.tasting_name;
		const price = info.tasting_price;
		const currency = info.tasting_currency;
		const vintage = info.tasting_vintage;

		const hasMedalSetting = metadata.medal_page;
		const isRound2 = event.swa_round_2;

		return {
			eventRef,
			wineType,
			wineColor,
			name,
			price,
			currency,
			vintage,
			hasMedalSetting,
			isRound2,
		};
	};

	getEventBreadcrumbText() {
		const {name, price, currency, vintage, country, region} = this.getEventInfo();
		const priceWithCurrency = getCurrency(price, currency);
		const breadcrumbs = [name, vintage, region, country, priceWithCurrency].filter(Boolean);

		return breadcrumbs.join(', ');
	}

	render() {
		const {eventRef, wineType, wineColor, hasMedalSetting, isRound2} = this.getEventInfo();
		const {price, currency} = this.getEventInfo();

		const priceWithCurrency = price && currency;

		if (!eventRef) {
			return <Redirect to={routeConstants.NOT_FOUND} />;
		}

		const {multiStepForm} = this.props;
		const tastingSetup = getTastingSetup({wineType, wineColor});

		const steps = [
			{
				name: <L18nText id="tasting_info" defaultMessage="Info" />,
				component: (
					<InfoStep
						stepKey="info"
						initState={this.initState && this.initState.info ? this.initState.info : null}
						requiredFields={info.required}
						name="wine_details"
					/>
				),
			},
			{
				name: <L18nText id="nose_" defaultMessage="Nose" />,
				component: false, //set component to false to render the substeps
				subSteps: tastingSetup.steps.nose.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
							requiredFields={noseData.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="tasting_note" defaultMessage="Tasting Note" />,
				component: (
					<PersonalNoteStep
						stepKey="comments"
						initState={this.initState}
						name="tasting_note"
						customTitle="tasting_note"
						customSubTitle="tasting_note_consider_notice"
						customRatings={[]}
						hideLocationAndPrice
						displayFoodPairing={isRound2}
					/>
				),
			},
			{
				name: <L18nText id="tasting_characteristics" defaultMessage="Characteristics" />,
				component: false, //set component to false to render the substeps
				subSteps: tastingSetup.steps.characteristics.map((characteristics, index) => {
					return (
						<FormStep
							stepKey="characteristics"
							data={characteristics}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={characteristics.isMultiple}
							requiredFields={characteristics.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="tasting_observations" defaultMessage="Observations" />,
				component: false, //set component to false to render the substeps
				subSteps: tastingSetup.steps.observations.map((observation, index) => {
					return (
						<FormStep
							stepKey="observations"
							data={observation}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={observation.isMultiple}
							requiredFields={observation.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="tasting_rating" defaultMessage="Rating" />,
				component: <RatingStep stepKey="rating" showTitle />,
			},

			{
				name: <L18nText id="tasting_medal" defaultMessage="Medal" />,
				component: (
					<MedalStep
						name="selectedMedal"
						stepKey="medal"
						isMedal={hasMedalSetting}
						requiredFields={['selectedMedal']}
					/>
				),
			},
		];

		let message = null;

		if (multiStepForm && multiStepForm.error && multiStepForm.error.message !== null) {
			let classNames = 'status-message';

			if (multiStepForm.error.status === 'success') {
				classNames = 'alert alert-success';
			}

			if (multiStepForm.error.status === 'error') {
				classNames = 'alert alert-danger';
			}

			message = <div className={classNames}>{multiStepForm.error.message}</div>;
		}

		return (
			<div className="mulit-step-form-wrapper">
				<MultiStepForm
					tastingSrc={tastingSetup.tastingSrc}
					showNavigation={true}
					steps={steps}
					isQuickTasting={true}
					formSubmitCallback={this.handleFormSubmission}
					fixedBreadcrumb={this.getEventBreadcrumbText()}
					boldLastText={priceWithCurrency}
					hideProgressBar
				/>
				{message}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		app: state.app,
		user: state.user,
		offline: state.offline,
		multiStepForm: state.multiStepForm,
		eventTastingData: state.events.tastingShowCaseData.selectedTasting,
		eventMetadata: getSelectedEventMetadata(state),
	};
}

const mapDispatchToProps = {
	updateSelectedItem,
	submitForm,
	navigateForm,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SWA20)));
