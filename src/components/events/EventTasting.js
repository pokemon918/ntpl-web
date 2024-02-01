import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {
	updateSelectedItem,
	initStepData,
	initEventTasting,
	updateStepSelections,
	resetForm,
	resetSession,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
	navigateForm,
	eventTastingInitStep,
} from 'actions/multiStepFormActions';

import {routeConstants} from 'const';
import tasting from 'config/tasting';
import {getTastingComponent} from 'components/tasting/types';
import updateBoxSelections from 'commons/updateBoxSelections';
import 'assets/scss/shared/make-tasting-page.scss';
import {fetchSelectedEvent, setTastingShowcaseData} from 'actions/eventActions';
import {getLinkWithArguments} from 'commons/commons';

let unlisten = null;

class EventTasting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			prompt: false,
			loadData: false,
		};
		this.initEventTastingData = this.initEventTastingData.bind(this);
		this.prefillSelectedNotes = this.prefillSelectedNotes.bind(this);
		this.prefillAppearanceNotes = this.prefillAppearanceNotes.bind(this);
		this.initAppearance = this.initAppearance.bind(this);
		this.prefillRatingStep = this.prefillRatingStep.bind(this);
		this.prefillCommentStep = this.prefillCommentStep.bind(this);
		this.prefillInfoStep = this.prefillInfoStep.bind(this);
		props.setTastingType(this.props.tastingShowCaseData.type);

		const {multiStepForm} = props;
		const prevSession = multiStepForm.lastSessionData[this.props.tastingShowCaseData.type];

		if (
			this.props.tastingShowCaseData.type !== multiStepForm.tastingType ||
			(!multiStepForm.navigatedAway && (prevSession === null || prevSession === undefined))
		) {
			this.initEventTastingData();
		}
	}

	initEventTastingData() {
		let selectedTasting = this.props.tastingShowCaseData.selectedTasting;
		console.log(this.props, 'CONSTRUCTOR PROPS');
		/*
            Disable pre-filling of selected notes: 
                this.prefillSelectedNotes(selectedTasting.notes); 
                this.prefillRatingStep(selectedTasting.rating);*/
		this.prefillCommentStep(selectedTasting);
		this.prefillInfoStep(selectedTasting);
	}

	prefillSelectedNotes(notes) {
		const type = this.props.tastingShowCaseData.type;
		const tastingData = tasting.data[type];
		const tastingSrc = tasting.source[type];

		this.prefillAppearanceNotes(notes, tastingData.appearance, tastingSrc);
	}

	prefillAppearanceNotes(notes, appearanceData, tastingSrc) {
		let selectedAppearance = {};

		appearanceData.keys.forEach((key) => {
			if (key === 'nuance_tint_') {
				let tintKey = selectedAppearance['color_'];
				if (tastingSrc[tintKey]) {
					tastingSrc[tintKey].forEach((l2key) => {
						let noteIndex = notes.indexOf(l2key);
						if (noteIndex !== -1) {
							selectedAppearance[key] = l2key;
						}
					});
				}
			} else {
				if (tastingSrc[key]) {
					tastingSrc[key].forEach((l2key) => {
						let noteIndex = notes.indexOf(l2key);
						if (noteIndex !== -1) {
							selectedAppearance[key] = l2key;
						}
					});
				}
			}
		});

		this.initAppearance(selectedAppearance, tastingSrc, 'appearance', appearanceData);
	}

	initAppearance(selectedAppearance, tastingSrc, key, appearanceData) {
		this.props.initEventTasting(selectedAppearance, tastingSrc, key, appearanceData);
	}

	handleOptionSelect(stepData, selectionKey, value) {
		const {tastingShowCaseData} = this.props;
		const {selections, activeSelection} = stepData;
		const type = tastingShowCaseData.type;
		const tastingSrc = tasting.source[type];

		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false

		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);

			if (tempSelection.key === selectionKey) {
				tempSelection.isActive = true;
				tempSelection.activeOption = value;
				newActiveSelection = tempSelection;
			}
		});

		updateBoxSelections(null, tastingSrc, selectionKey, newSelections, newActiveSelection);

		this.props.updateStepSelections(this.props.step, {
			selections: newSelections,
			activeSelection: newActiveSelection,
		});
	}

	prefillRatingStep(rating) {
		let newRatingData = {
			rating_balance_: rating.balance,
			rating_finish__: rating.length,
			rating_intensity__: rating.intensity,
			rating_complexity_: rating.complexity,
			rating_terroir_: rating.terroir,
			rating_quality__: rating.quality,
			rating_drinkability_: rating.drinkability,
		};
		this.props.updateSelectedItem('rating', newRatingData);
	}

	prefillCommentStep(selectedTasting) {
		if (!selectedTasting) return;
		let newCommentsData = {
			personal_location: selectedTasting.location,
			rating_maturity_: selectedTasting.maturity,
			rating_drinkability_: selectedTasting.drinkability,
		};
		this.props.updateSelectedItem('comments', newCommentsData);
	}

	prefillInfoStep(selectedTasting) {
		if (!selectedTasting) return;
		let newInfoData = {
			tasting_name: selectedTasting.name,
			tasting_country_key: selectedTasting.country_key,
			tasting_country: selectedTasting.country,
			tasting_region: selectedTasting.region,
			tasting_producer: selectedTasting.producer,
			tasting_vintage: selectedTasting.vintage,
			tasting_grape: selectedTasting.grape,
			tasting_price: selectedTasting.price,
			tasting_currency: selectedTasting.currency,
			tasting_location: selectedTasting.location,
		};

		this.props.updateSelectedItem('info', newInfoData);
	}

	togglePrompt = () => {
		this.setState({
			prompt: !this.state.prompt,
		});
	};

	handleNo = () => {
		this.props.restartSession();
		this.props.history.go(this.props.location.pathname);
		this.togglePrompt();
	};

	handleYes = () => {
		this.props.restoreSession(this.props.tastingShowCaseData.type);
		this.togglePrompt();
	};

	componentWillUnmount() {
		this.props.resetSession();
		unlisten();
	}

	async componentDidMount() {
		const {multiStepForm} = this.props;
		const {
			match: {params},
		} = this.props;

		const hasPrevSession = multiStepForm.lastSessionData[this.props.tastingShowCaseData.type];

		this.props.navigateForm(1);
		this.props.eventTastingInitStep(false);

		this.props.updateSelectedItem('collection', {id: params.eventRef, mold: params.tastingRef});

		if (multiStepForm.navigatedAway && hasPrevSession) {
			this.togglePrompt();
		}

		unlisten = this.props.history.listen((nextLocation, action) => {
			let currentLocation = this.props.location;
			if (currentLocation.pathname !== nextLocation.pathname) {
				this.props.navigateAway(this.props.tastingShowCaseData.type);
			}
		});
	}

	render() {
		const {
			match: {params},
		} = this.props;
		let {type, eventRef, tastingRef} = params;

		const ActiveTasting = getTastingComponent(type);
		if (!this.props?.tastingShowCaseData?.selectedTasting && type && eventRef && tastingRef) {
			return (
				<Redirect
					to={{
						pathname: getLinkWithArguments(routeConstants.NEW_EVENT_TASTING, {
							ref: eventRef,
							tastingRef: tastingRef,
						}),
						state: type,
					}}
				/>
			);
		}

		if (this.props.tastingShowCaseData === undefined || this.props.tastingShowCaseData === null) {
			return <Redirect to="/404/not-found" />;
		}
		if (!ActiveTasting) {
			return <Redirect to="/404/not-found" />;
		}

		return (
			<div className="new-tasting">
				<ActiveTasting history={this.props.history} event={params.eventRef} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		tastingShowCaseData: state.events.tastingShowCaseData,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {
	updateSelectedItem,
	initStepData,
	initEventTasting,
	updateStepSelections,
	resetForm,
	fetchSelectedEvent,
	setTastingShowcaseData,
	resetSession,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
	navigateForm,
	eventTastingInitStep,
})(EventTasting);
