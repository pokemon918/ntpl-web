import React, {Component} from 'react';
import {connect} from 'react-redux';

import {initStepData, submitForm} from 'actions/multiStepFormActions';
import appearance from 'assets/json/tasting/profound/appearance.json';
import info from 'assets/json/tasting/info.json';
import tasting from 'config/tasting';
import {getEventMetadata} from 'reducers/eventsReducer';

import TastingRatingTotal from 'components/shared/RatingBoard/TastingRatingTotal';
import MultiStepForm from '../MultiStepForm';
import {FormStep, InfoStep, RatingStep, MedalStep} from '../steps';

import 'assets/scss/shared/make-tasting-page.scss';
import {routeConstants, tastingsConstants} from 'const';
import L18nText from 'components/shared/L18nText';
import PersonalNoteStep from '../steps/PersonalNoteStep';
import TastingNoteStep from '../steps/TastingNoteStep';

import nose from 'assets/json/tasting/profound/mobile/nose/noseMobile.json';
import observations from 'assets/json/tasting/profound/mobile/observationsMobile.json';
import appearanceMobile from 'assets/json/tasting/profound/mobile/appearanceMobile.json';
import characteristics from 'assets/json/tasting/profound/mobile/palate/characteristicsMobile.json';

import primaryAroma from 'assets/json/tasting/profound/mobile/nose/primaryAromaMobile.json';
import tertiaryAroma from 'assets/json/tasting/profound/mobile/nose/tertiaryAromaMobile.json';
import secondaryAroma from 'assets/json/tasting/profound/mobile/nose/secondaryAromaMobile.json';

import primaryAromaPalate from 'assets/json/tasting/profound/mobile/palate/primaryAromaMobile.json';
import tertiaryAromaPalate from 'assets/json/tasting/profound/mobile/palate/tertiaryAromaMobile.json';
import secondaryAromaPalate from 'assets/json/tasting/profound/mobile/palate/secondaryAromaMobile.json';

class Profound extends Component {
	constructor(props) {
		super(props);
		this.appearance = appearance;
		this.initState = props.event ? props.multiStepForm.selectedItems : null;
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}

	componentDidMount() {
		this.loadAllPalateSubSteps();
	}

	loadAllPalateSubSteps() {
		const {tastingType, selectedItems} = this.props.multiStepForm;
		const tastingSrc = tasting.source['profound'];
		const stepKey = 'palate';

		const loadStep = (absoluteIndex, data) => {
			const isSubStep = 'true';
			const subStepName = `step${absoluteIndex}`;
			this.props.initStepData(
				tastingSrc,
				stepKey,
				data,
				isSubStep,
				subStepName,
				tastingType,
				selectedItems
			);
		};

		characteristics.forEach((data, index) => {
			const absoluteIndex = index + 1;
			loadStep(absoluteIndex, data);
		});

		primaryAromaPalate.forEach((data, index) => {
			const absoluteIndex = characteristics.length + index + 1;
			loadStep(absoluteIndex, data);
		});

		secondaryAromaPalate.forEach((data, index) => {
			const absoluteIndex = characteristics.length + primaryAromaPalate.length + index + 1;
			loadStep(absoluteIndex, data);
		});

		tertiaryAromaPalate.forEach((data, index) => {
			const absoluteIndex =
				characteristics.length +
				primaryAromaPalate.length +
				secondaryAromaPalate.length +
				index +
				1;
			loadStep(absoluteIndex, data);
		});
	}

	async handleFormSubmission() {
		const {
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		const result = await this.props.submitForm(
			this.props.multiStepForm.selectedItems,
			online,
			tastingsConstants.PROFOUND
		);

		if (result) {
			const {event} = this.props;
			const redirectUrl = routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	render() {
		const {multiStepForm, eventMetadata} = this.props;

		const tastingSrc = tasting.source['profound'];

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
				name: <L18nText id="appearance_" defaultMessage="Appearance" />,
				component: false, //set component to false to render the substeps
				subSteps: appearanceMobile.map((appearanceData, index) => {
					return (
						<FormStep
							stepKey="appearance"
							data={appearanceData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={appearanceData.isMultiple}
							requiredFields={appearanceData.required}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: nose.map((noseData, index) => {
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
				component: false, //set component to false to render the substeps
				subSteps: primaryAroma.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={'step' + (nose.length + index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: secondaryAroma.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={'step' + (nose.length + primaryAroma.length + index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: tertiaryAroma.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={
								'step' + (nose.length + primaryAroma.length + secondaryAroma.length + index + 1)
							}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: characteristics.map((characteristicsData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={characteristicsData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={characteristicsData.isMultiple}
							requiredFields={characteristicsData.required}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: primaryAromaPalate.map((noseData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={noseData}
							name={'step' + (characteristics.length + index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: secondaryAromaPalate.map((noseData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={noseData}
							name={'step' + (characteristics.length + primaryAromaPalate.length + index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: tertiaryAromaPalate.map((noseData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={noseData}
							name={
								'step' +
								(characteristics.length +
									primaryAromaPalate.length +
									secondaryAromaPalate.length +
									index +
									1)
							}
							isSubStep="true"
							multiple={noseData.isMultiple}
						/>
					);
				}),
			},
			{
				component: false, //set component to false to render the substeps
				subSteps: observations.map((observationsData, index) => {
					return (
						<FormStep
							stepKey="observations"
							data={observationsData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={observationsData.isMultiple}
							requiredFields={observationsData.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="tasting_rating" defaultMessage="Rating" />,
				component: <RatingStep stepKey="rating" />,
				headerAddon: <TastingRatingTotal />,
			},
			{
				name: <L18nText id="tasting_note" defaultMessage="Tasting Note" />,
				component: <TastingNoteStep stepKey="tasting_note" name="tasting_note" />,
			},
			{
				name: <L18nText id="tasting_personal_notes" defaultMessage="Personal Note" />,
				component: (
					<PersonalNoteStep
						stepKey="tasting_personal_notes"
						initState={this.initState}
						name="tasting_personal_notes"
					/>
				),
			},
		];

		if (eventMetadata && eventMetadata.medal_page) {
			steps.push({
				name: <L18nText id="tasting_medal" defaultMessage="Medal" />,
				component: <MedalStep />,
			});
		}

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
					tastingSrc={tastingSrc}
					showNavigation={true}
					steps={steps}
					formSubmitCallback={this.handleFormSubmission}
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
		eventMetadata: getEventMetadata(state, ownProps.event),
	};
}

export default connect(mapStateToProps, {initStepData, submitForm})(Profound);
