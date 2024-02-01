import React, {Component} from 'react';
import {connect} from 'react-redux';
import L18nText from 'components/shared/L18nText';

import {submitForm, presetInfo} from 'actions/multiStepFormActions';
import {clearWineEvent} from 'actions/wineActions';
import appearance from 'assets/json/tasting/quick/appearance.json';
import fortifiedAppearance from 'assets/json/tasting/quick/fortified_appearance.json';
import info from 'assets/json/tasting/info.json';
import tasting from 'config/tasting';

import {getEventMetadata} from 'reducers/eventsReducer';

import TastingRatingTotal from 'components/shared/RatingBoard/TastingRatingTotal';
import MultiStepForm from '../MultiStepForm';
import {PersonalNoteStep, FormStep, InfoStep, RatingStep, MedalStep} from '../steps';

import notes from 'assets/json/tasting/quick/nose.json';
import observations from 'assets/json/tasting/quick/observations.json';
import redStillNotes from 'assets/json/tasting/quick/still/redNotes.json';
import orangeStillNotes from 'assets/json/tasting/quick/still/orangeNotes.json';
import roseStillNotes from 'assets/json/tasting/quick/still/roseNotes.json';
import characteristics from 'assets/json/tasting/quick/characteristics.json';
import sherryCharacteristics from 'assets/json/tasting/quick/sherry_characteristics.json';
import whiteStillNotes from 'assets/json/tasting/quick/still/whiteNotes.json';
import redSparklingNotes from 'assets/json/tasting/quick/sparkling/redNotes.json';
import orangeSparklingNotes from 'assets/json/tasting/quick/sparkling/orangeNotes.json';
import roseSparklingNotes from 'assets/json/tasting/quick/sparkling/roseNotes.json';
import whiteSparklingNotes from 'assets/json/tasting/quick/sparkling/whiteNotes.json';
import fortifiedPortRedNotes from 'assets/json/tasting/quick/fortified/port/redNotes.json';
import fortifiedPortWhiteNotes from 'assets/json/tasting/quick/fortified/port/whiteNotes.json';
import fortifiedPortDefaultNotes from 'assets/json/tasting/quick/fortified/port/defaultNotes.json';
import fortifiedSherryWhiteNotes from 'assets/json/tasting/quick/fortified/sherry/whiteNotes.json';
import 'assets/scss/shared/make-tasting-page.scss';
import {routeConstants, tastingsConstants} from 'const';

class Quick extends Component {
	constructor(props) {
		super(props);
		this.noteData = [];
		this.characteristicsData = [];
		this.appearance = fortifiedAppearance;
		if (this.skipSteps(props.wineEvent)) {
			props.presetInfo({
				info: {
					tasting_country: props.wineEvent.product.country,
					tasting_grape: props.wineEvent.product.grape,
					tasting_name: props.wineEvent.product.shortName,
					tasting_producer: props.wineEvent.producer.name,
					tasting_region: props.wineEvent.product.region,
					tasting_vintage: props.wineEvent.product.vintage,
					bottlebook_product_id: this.product,
					bottlebook_client_id: this.client,
					bottlebook_event_id: this.event,
					bottlebook_producer_id: props.wineEvent.producer.producerId,
				},
				appearance: {
					winetype_: this.mapWineType(props.wineEvent),
					color_: this.mapWineColor(props.wineEvent),
				},
			});
		} else {
			this.initState = props.event != null ? props.multiStepForm.selectedItems : null;
		}
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}

	get product() {
		return new URL(window.location.href).searchParams.get('product');
	}

	get event() {
		return new URL(window.location.href).searchParams.get('event');
	}

	get client() {
		return new URL(window.location.href).searchParams.get('client');
	}

	skipSteps(wineEvent) {
		return (
			wineEvent != null &&
			this.product != null &&
			this.event != null &&
			wineEvent.event.eventId === this.event &&
			wineEvent.product.productId === this.product
		);
	}
	mapWineType(wineEvent) {
		const wineTypeMap = {
			wine: 'category_still',
			sparkling: 'category_sparkling',
			sherry: 'type_sherry_',
			port: 'type_port',
		};
		return wineTypeMap[wineEvent.product.wineType] ?? null;
	}

	mapWineColor(wineEvent) {
		const wineColorMap = {
			white: 'nuance_white',
			red: 'nuance_red',
			orange: 'nuance_orange',
			rose: 'nuance_rose',
		};
		return wineColorMap[wineEvent.product.wineColor] ?? null;
	}

	async handleFormSubmission() {
		const {
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		const result = await this.props.submitForm(
			this.props.multiStepForm.selectedItems,
			online,
			tastingsConstants.QUICK,
			this.props.history
		);

		if (result) {
			const {event, clearWineEvent, wineEvent} = this.props;
			clearWineEvent();
			const redirectUrl = this.skipSteps(wineEvent)
				? routeConstants.NEW_TASTING_RESULT
				: routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	/**
	 * Get notedata with respective to selected appearance.
	 *
	 * @param {string} winetype_
	 * @returns {array}

	 */

	_getNoteData = (color, type) => {
		let noteData = notes;

		if (color === 'nuance_white' && type === 'category_still') {
			noteData = whiteStillNotes;
		}

		if (color === 'nuance_red' && type === 'category_still') {
			noteData = redStillNotes;
		}

		if (color === 'nuance_white' && type === 'category_sparkling') {
			noteData = whiteSparklingNotes;
		}

		if (color === 'nuance_red' && type === 'category_sparkling') {
			noteData = redSparklingNotes;
		}

		if (color === 'nuance_orange' && type === 'category_still') {
			noteData = orangeStillNotes;
		}

		if (color === 'nuance_orange' && type === 'category_sparkling') {
			noteData = orangeSparklingNotes;
		}

		if (color === 'nuance_rose' && type === 'category_still') {
			noteData = roseStillNotes;
		}

		if (color === 'nuance_rose' && type === 'category_sparkling') {
			noteData = roseSparklingNotes;
		}

		if (color === 'nuance_white' && type === 'type_sherry_') {
			noteData = fortifiedSherryWhiteNotes;
		}

		if (['type_port', 'category_fortified'].includes(type)) {
			if (color === 'nuance_white') {
				noteData = fortifiedPortWhiteNotes;
			} else if (color === 'nuance_red') {
				noteData = fortifiedPortRedNotes;
			} else {
				noteData = fortifiedPortDefaultNotes;
			}
		}

		return noteData;
	};

	_getCharacteristicseData = (type) => {
		if (type === 'winetype_fortified_sherry') {
			return sherryCharacteristics;
		}

		return characteristics;
	};

	_getAppearenceData = (type) => {
		if (type === 'winetype_fortified_sherry') {
			return fortifiedAppearance;
		}

		return appearance;
	};

	render() {
		const {multiStepForm, eventMetadata, wineEvent} = this.props;
		const tastingSrc = tasting.source['quick'];
		const {selectedItems = {}} = multiStepForm;

		if (selectedItems.appearance) {
			const {color_, winetype_} = selectedItems.appearance;

			this.appearance = this._getAppearenceData(winetype_);
			this.noteData = this._getNoteData(color_, winetype_);
			this.characteristicsData = this._getCharacteristicseData(winetype_);
		}

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
				subSteps: this.appearance.map((appearanceData, index) => {
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
				name: <L18nText id="nose_" defaultMessage="Nose" />,
				serializerKey: 'nose',
				serializerData: this.noteData,
				component: false, //set component to false to render the substeps
				subSteps: this.noteData.map((noseData, index) => {
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
				name: <L18nText id="tasting_characteristics" defaultMessage="Characteristics" />,
				serializerKey: 'characteristics',
				serializerData: this.characteristicsData,
				component: false, //set component to false to render the substeps
				subSteps: this.characteristicsData.map((characteristics, index) => {
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
				serializerKey: 'observations',
				serializerData: observations,
				component: (
					<FormStep
						stepKey="observations"
						name="step1"
						requiredFields={observations.required}
						data={observations}
					/>
				),
			},
			{
				name: <L18nText id="tasting_rating" defaultMessage="Rating" />,
				component: <RatingStep stepKey="rating" />,
				headerAddon: <TastingRatingTotal />,
			},
			{
				name: <L18nText id="tasting_note" defaultMessage="Tasting Note" />,
				component: (
					<PersonalNoteStep
						stepKey="comments"
						initState={this.initState}
						name="tasting_note"
						customTitle="tasting_note"
					/>
				),
			},
		];

		if (this.skipSteps(wineEvent) && this.mapWineType(this.props.wineEvent) != null) {
			steps.shift();
			if (this.mapWineColor(this.props.wineEvent) != null) {
				steps.shift();
			}
		}

		if (eventMetadata && eventMetadata.medal_page) {
			steps.push({
				name: <L18nText id="tasting_medal" defaultMessage="Medal" />,
				component: (
					<MedalStep name="selectedMedal" stepKey="medal" requiredFields={['selectedMedal']} />
				),
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
					isQuickTasting={true}
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
		wineEvent: state.wineEvent.data,
		multiStepForm: state.multiStepForm,
		eventMetadata: getEventMetadata(state, ownProps.event),
	};
}

export default connect(mapStateToProps, {submitForm, presetInfo, clearWineEvent})(Quick);
