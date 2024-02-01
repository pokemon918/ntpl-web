import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {withRouter} from 'react-router-dom';
import DialogBox from 'components/shared/ui/DialogBox';
import Spinner from 'components/shared/ui/Spinner';

import {
	navigateForm,
	copyAromaNotes,
	initTastingSrc,
	updateProgresbar,
} from 'actions/multiStepFormActions';
import appConfig from 'config/app';

import {ReactComponent as Next} from './Next.svg';
import {ReactComponent as Back} from './Back.svg';

import nose from 'assets/json/tasting/nose.json';
import logic from 'assets/json/tasting/logic.json';

import {getLinkWithArguments} from 'commons/commons';
import Modal from 'components/shared/ui/Modal';
import Button from 'components/shared/ui/Button';
import {routeConstants, tastingsConstants} from 'const';

import './MultiStepForm.scss';
import L18nText from 'components/shared/L18nText';
import {setEventPreventReload} from 'actions/eventActions';

const pathsToSkipClosePrompt = [routeConstants.NEW_TASTING_TYPE, routeConstants.EDIT_TASTING];

// TODO: bring back the progress bar after fixing the componentDidUpdate/setState infinite loop
// ref: https://trello.com/c/Pq6xIcFW/2132-bug-2132-ntbl-web-invariant-violation-in-event-edn2dtx-dmlxrlr-swa20-dev
/*
const tastingSection = ['appearance-step1', 'palate-step1', 'nose-step1', 'observations-step1'];
const TASTINGS_TYPES_WITH_SPLASH_SCREEN = [
	'profound',
	'profoundMobile',
	'scholar2',
	'scholar2m',
	'scholar3',
	'scholar3m',
	'scholar4',
	'scholar4m',
];//*/

const getNavStates = (indx, length) => {
	let styles = [];
	for (let i = 0; i < length; i++) {
		if (i < indx) {
			styles.push('done');
		} else if (i === indx) {
			styles.push('doing');
		} else {
			styles.push('todo');
		}
	}
	return {current: indx, styles: styles};
};

const checkNavState = (currentStep, stepsLength, currentSubStep = 0, subStepLength = 0) => {
	/*
    Show both buttons when...
    1. The current step is greater than 0 and less than the steps length
    2. There's an available substep and the currentSubStep is greater than 0 but less than the subStepLength
  */
	if (
		(currentStep > 0 && currentStep < stepsLength - 1) ||
		(subStepLength > 0 && currentSubStep > 0 && currentSubStep < subStepLength)
	) {
		return {
			showPreviousBtn: true,
			showNextBtn: true,
			showSaveBtn: false,
		};
	} else if (currentStep === 0) {
		return {
			showPreviousBtn: false,
			showNextBtn: true,
			showSaveBtn: false,
		};
	} else {
		return {
			showPreviousBtn: true,
			showNextBtn: false,
			showSaveBtn: true,
		};
	}
};

const getStepCopyAroma = {
	profoundMobile: 'step8',
	scholar2m: 'step6',
	scholar3m: 'step9',
	scholar4m: 'step8',
};

const helpingText = {
	tasting_aromas_primary: (
		<L18nText
			id={'tasting_scholar_primary_sub_header'}
			defaultMessage="The aromas and flavours of the grape and alcoholic fermentation"
		/>
	),
	tasting_aromas_secondary: (
		<L18nText
			id={'tasting_scholar_secondary_sub_header'}
			defaultMessage="The aromas and flavours of post-fermentation winemaking"
		/>
	),
	tasting_aromas_tertiary: (
		<L18nText
			id={'tasting_scholar_tertiary_sub_header'}
			defaultMessage="The aromas and flavours of maturation"
		/>
	),
	tasting_observations: (
		<L18nText
			id={'tasting_scholar_observation_sub_header'}
			defaultMessage="An explanation supporting the assessment of a wine’s suitability for bottle ageing will be required"
		/>
	),
	tasting_other_observation: (
		<L18nText id={'tasting_other_observation_subHeader'} defaultMessage="(e.g. texture)" />
	),
};

let percentDone = 0;

class MultiStepForm extends React.Component {
	constructor(props) {
		super(props);
		const {navButtons = {}} = props.multiStepForm.navState;
		this.state = {
			showCloseModal: false,
			percentDone: 0,
			showPreviousBtn: navButtons.showPreviousBtn,
			showNextBtn: navButtons.showNextBtn,
			showSaveBtn: navButtons.showSaveBtn,
			disableNextBtn: navButtons.disableNextBtn,
			disableSaveBtn: false,
			isSaving: false,
			homeButtonUrl: routeConstants.TASTING,
			homeButtonText: 'nav_overview',
			compState: props.multiStepForm.navState.compState,
			subCompState: props.multiStepForm.navState.subCompState,
			navState: props.multiStepForm.navState.progressBarState
				? props.multiStepForm.navState.progressBarState
				: getNavStates(0, this.props.steps.length),
			leaveTasting: false,
			directionNav: () => {},
		};
		props.initTastingSrc(props.tastingSrc);
		this.renderProgressBar = this.renderProgressBar.bind(this);
	}

	componentDidMount() {
		const {
			match: {params},
		} = this.props;

		this.verifyTastingPermission();

		if (params.eventRef) {
			setEventPreventReload(true);
			this.setState({
				homeButtonUrl: getLinkWithArguments(routeConstants.EVENT_REF, {
					eventRef: params.eventRef,
				}),
				homeButtonText: 'tasting_back_to_event',
			});
		}
		this.setupGlobalEventHandlers();
		this.props.updateProgresbar(percentDone);
	}

	componentWillUnmount() {
		window.onbeforeunload = null;
	}

	// in practice, for these particular events, using the global event handlers
	// showed to be more reliable than using addEventListener
	setupGlobalEventHandlers = () => {
		const {
			match: {path, url},
		} = this.props;

		const showClosePrompt = !pathsToSkipClosePrompt.includes(path);

		window.onbeforeunload = () => {
			return true;
		};

		window.onpopstate = () => {
			const {history} = this.props;

			if (history.location.pathname === '/tastings') {
				return false;
			}

			if (showClosePrompt) {
				if (!window.confirm('Are you sure you want to leave?')) {
					history.push(url);
				} else {
					window.onpopstate = null;
				}
			}
		};
	};

	getTitle = () => {
		const selectedPageData = this.getCurrentComponent() && this.getCurrentComponent().props;
		if (!selectedPageData) return null;
		return selectedPageData.data ? selectedPageData.data.name : selectedPageData.name;
	};

	isScholarView = () => {
		const {
			multiStepForm: {tastingType},
		} = this.props;

		return (
			tastingType === 'scholar2' ||
			tastingType === 'scholar2m' ||
			tastingType === 'scholar3' ||
			tastingType === 'scholar3m' ||
			tastingType === 'scholar4' ||
			tastingType === 'scholar4m'
		);
	};

	verifyTastingPermission = () => {
		const {
			activePlan,
			multiStepForm: {tastingType},
			history,
		} = this.props;
		const {ENABLED_TASTING_TYPES} = tastingsConstants;

		const currentTastingSettings = ENABLED_TASTING_TYPES.find(
			(tasting) => tasting.id === tastingType
		);
		if (currentTastingSettings && !currentTastingSettings.plans.includes(activePlan)) {
			history.replace(routeConstants.SUBSCRIPTION);
		}
	};

	handleYes = () => {
		const {
			match: {params},
		} = this.props;

		if (params.eventRef) {
			this.props.setEventPreventReload(true);
		}

		this.navigateToHome();
		this.setState({showCloseModal: false, leaveTasting: true});
	};

	onCloseModal = () => {
		this.setState({showCloseModal: true});
	};

	handleNo = () => {
		this.setState({showCloseModal: false});
	};

	toggleDialog = () => {
		this.setState({showCloseModal: !this.state.showCloseModal});
	};

	getTitleFromSubKey = {
		mineralities: 'Minerality',
		rating: 'Rating',
		info: 'Info',
	};

	setNavState = (next, nextSubStep = 0) => {
		const {steps, loadAllPalateSubSteps} = this.props;

		this.setState({
			navState: getNavStates(next, steps.length),
		});

		if (next < steps.length) {
			this.setState({
				compState: next,
				subCompState: nextSubStep,
			});
		}

		let buttonState = {};

		// if the current component has substeps, include/handle next and prev button for the substeps
		if (steps[next] && steps[next].subSteps && nextSubStep < steps[next].subSteps.length) {
			buttonState = checkNavState(next, steps.length, nextSubStep, steps[next].subSteps.length);
		} else {
			buttonState = checkNavState(next, steps.length);
		}

		this.setState(buttonState);
		this.props.navigateForm(next, nextSubStep, getNavStates(next, steps.length), buttonState);

		return loadAllPalateSubSteps && loadAllPalateSubSteps();
	};

	jumpToStep = (evt) => {
		if (appConfig.DEV_MODE) {
			if (
				evt.currentTarget.value === this.props.steps.length - 1 &&
				this.state.compState === this.props.steps.length - 1
			) {
				this.setNavState(this.props.steps.length);
			} else {
				this.setNavState(evt.currentTarget.value);
			}
		}
	};

	next = () => {
		const {compState, subCompState, disableNextBtn} = this.state;
		const {steps} = this.props;

		let currentComponent = steps[compState].component;

		// prevent going next if any required field is missing
		if (disableNextBtn) {
			return;
		}

		// Reset next button when navigating the form
		this.disableNextOrSaveBtn(false);

		if (currentComponent) {
			this.setNavState(this.state.compState + 1);
		} else {
			if (subCompState + 1 < steps[compState].subSteps.length) {
				this.setNavState(this.state.compState, subCompState + 1);
			} else {
				this.setNavState(this.state.compState + 1);
			}
		}

		this.setState({
			directionNav: this.next,
		});
	};

	navigateToHome = () => {
		window.onpopstate = null;
		this.props.history.replace(this.state.homeButtonUrl);
	};

	previous = () => {
		const {compState, subCompState} = this.state;
		const {
			steps,
			multiStepForm: {navState, selectedItems = {}},
			match: {params},
		} = this.props;
		const {collection = {}} = selectedItems;
		const {id: collectionRef} = collection;

		const isEvent = params.eventRef || collectionRef;
		if (isEvent && navState && navState.compState === 1 && navState.subCompState === 0) {
			// prevents event tastings to display the first step, usually containing the info step
			this.onCloseModal();
		} else {
			// Reset next button when navigating the form
			this.disableNextOrSaveBtn(false);
			let currentComponent = steps[compState].component;

			if (currentComponent) {
				// Check if the next component has a substep, if true, start from the last subcomponent
				let nextSubStep = steps[this.state.compState - 1].subSteps;

				if (nextSubStep) {
					this.setNavState(this.state.compState - 1, nextSubStep.length - 1);
				} else {
					this.setNavState(this.state.compState - 1);
				}
			} else {
				if (subCompState > 0) {
					this.setNavState(this.state.compState, subCompState - 1);
				} else {
					if (this.state.compState > 0) {
						// Check if the next component has a substep, if true, start from the last subcomponent
						let nextSubStep = steps[this.state.compState - 1].subSteps;
						if (nextSubStep) {
							this.setNavState(this.state.compState - 1, nextSubStep.length - 1);
						} else {
							this.setNavState(this.state.compState - 1);
						}
					}
				}
			}
		}
		this.setState({
			directionNav: this.previous,
		});
	};

	save = async () => {
		this.setState({
			disableSaveBtn: true,
			isSaving: true,
		});
		await this.props.formSubmitCallback();
		this.setState({isSaving: false});
	};

	copyAromaNotes = () => {
		this.setState({isCopying: true});
		setTimeout(() => {
			this.setState({isCopying: false});
		}, 700);

		const {selectedItems, tastingType} = this.props.multiStepForm;
		const name = this.getCurrentComponent().props.name;
		const aromaKeys =
			tastingType === 'light' ? ['notes_'] : nose[1].keys.concat(nose[2].keys).concat(nose[3].keys);
		const selectedNoseItems = selectedItems.nose;
		const aromaNotes = {};

		// Get all aroma notes from nose['notes_floral_']
		if (
			selectedNoseItems &&
			(name === 'step2' ||
				name === 'step3' ||
				name === 'step4' ||
				name === 'step6' ||
				name === 'step7' ||
				name === 'step8' ||
				name === 'step9')
		) {
			Object.keys(selectedNoseItems).forEach((key) => {
				if (aromaKeys.includes(key)) {
					aromaNotes[key] = selectedNoseItems[key];
				}
			});
			this.props.copyAromaNotes(aromaNotes, 'palate', name, tastingType);
		}
	};

	getClassName = (className, i) => {
		return className + '-' + this.state.navState.styles[i];
	};

	getCurrentComponent() {
		const {compState, subCompState} = this.state;
		const nextSteps = [
			'appearance-step1',
			'appearance-step2',
			'palate-step1',
			'palate-step2',
			'palate-step3',
			'palate-step4',
			'palate-step5',
			'nose-step1',
			'nose-step2',
			'nose-step4',
			'nose-step3',
			'nose-step5',
			'observations-step1',
			'characteristics-step1',
			'characteristics-step2',
			'characteristics-step3',
			'characteristics-step4',
			'characteristics-step5',
		];

		let currentStep = this.props.steps[compState];
		let currentComponent = null;

		if (currentStep.component) {
			currentComponent = currentStep.component;
		} else {
			currentComponent = currentStep.subSteps[subCompState];
		}

		if (!currentComponent) {
			return null;
		}

		const nextActions =
			currentComponent &&
			currentComponent.props &&
			nextSteps.indexOf(`${currentComponent.props.stepKey}-${currentComponent.props.name}`) !== -1;

		if (
			currentComponent &&
			((currentComponent.props && nextActions) ||
				currentComponent.props.stepKey === 'observations' ||
				currentComponent.props.stepKey === 'appearance' ||
				currentComponent.props.stepKey === 'nose' ||
				currentComponent.props.stepKey === 'palate')
		) {
			const customComponent = React.cloneElement(currentComponent, {
				customAction: () => {
					if (!currentComponent.props.multiple) {
						// postpone this to the next event loop to wait for validation state to propagate
						window.requestAnimationFrame(() => this.next());
					}
				},
				directionNav: () => {
					if (
						this.props.multiStepForm.tastingType === 'profoundMobile' ||
						this.props.multiStepForm.tastingType === 'scholar2m' ||
						this.props.multiStepForm.tastingType === 'scholar3m' ||
						this.props.multiStepForm.tastingType === 'scholar4m'
					)
						this.state.directionNav();
				},
				revalidateForm: this.revalidateForm,
				hideArrow: false,
			});
			return customComponent;
		}
		return React.cloneElement(currentComponent, {
			revalidateForm: this.revalidateForm,
		});
	}

	disableNextOrSaveBtn(disable = true) {
		if (disable) {
			// Handle the save button only when the user is on the last step
			if (this.state.compState === this.props.steps.length - 1) {
				if (!this.state.disableSaveBtn) {
					this.setState({
						disableSaveBtn: true,
					});
				}
			} else {
				if (!this.state.disableNextBtn) {
					this.setState({
						disableNextBtn: true,
					});
				}
			}
		} else {
			// Handle the save button only when the user is on the last step
			if (this.state.compState === this.props.steps.length - 1) {
				if (this.state.disableSaveBtn) {
					this.setState({
						disableSaveBtn: false,
					});
				}
			} else {
				if (this.state.disableNextBtn) {
					this.setState({
						disableNextBtn: false,
					});
				}
			}
		}
	}

	handleRequiredFields() {
		const currentComponent = this.getCurrentComponent();
		if (!currentComponent) return;

		const requiredFields = currentComponent.props.requiredFields;
		const stepKey = currentComponent.props.stepKey;
		const selectedItems = this.props.multiStepForm.selectedItems[stepKey];

		/*
			Logic for handling required items
			1. Check if there are required fields for the current step
			2. Get multiForm SelectedItems for the current step
			3. If there are any require fields, check if they already exists on multiStepForm.selectedItems and have actual values
			4. If all the required fields exists and have values, enable the next or save button else disable it
		*/

		if (requiredFields !== undefined && requiredFields !== null && requiredFields.length > 0) {
			if (selectedItems === undefined || selectedItems === null) {
				this.disableNextOrSaveBtn(true);
			} else {
				let filledOut = true;

				requiredFields.forEach((field) => {
					if (
						selectedItems &&
						(selectedItems[field] === undefined ||
							selectedItems[field] === null ||
							selectedItems[field] === '' ||
							selectedItems[field].toString().trim().length <= 0)
					) {
						if (stepKey !== 'appearance' && logic[field] && logic[field]['notif']) {
							// handle notif logic
							logic[field]['notif'].forEach((item) => {
								if (selectedItems[field] && !selectedItems[field].includes(item)) {
									filledOut = false;
								}
							});
						} else if (stepKey !== 'appearance' && logic[field] && logic[field]['onlyif']) {
							// handle onlyif logic
							logic[field]['onlyif'].forEach((item) => {
								if (selectedItems[field] && !selectedItems[field].includes(item)) {
									filledOut = false;
								}
							});
						} else {
							filledOut = false;
						}
					}
				});

				if (filledOut) {
					this.disableNextOrSaveBtn(false);
				} else if (this.state.isSaving) {
					this.disableNextOrSaveBtn(true);
				} else {
					this.disableNextOrSaveBtn(true);
				}
			}
		}
	}

	revalidateForm = () => this.disableNextOrSaveBtn(false);

	getCurrentHeaderAddon() {
		const {compState} = this.state;
		let currentStep = this.props.steps[compState];
		return currentStep.headerAddon;
	}

	componentDidUpdate(prevProps) {
		this.handleRequiredFields();
		const nextSteps = [
			'appearance-step1',
			'appearance-step2',
			'observations-step1',
			'nose-step2',
			'nose-step4',
			'nose-step3',
			'nose-step5',
			'palate-step1',
			'palate-step2',
			'palate-step3',
			'palate-step4',
			'palate-step5',
			'characteristics-step1',
			'characteristics-step2',
			'characteristics-step3',
			'characteristics-step4',
			'characteristics-step5',
		];

		const hideNext =
			this.getCurrentComponent() &&
			this.getCurrentComponent().props &&
			nextSteps.indexOf(
				`${this.getCurrentComponent().props.stepKey}-${this.getCurrentComponent().props.name}`
			) !== -1;
		if (
			this.getCurrentComponent() &&
			this.getCurrentComponent().props &&
			this.getCurrentComponent().props.stepKey !== 'appearance' &&
			this.props.multiStepForm.resetScroll &&
			this.getCurrentComponent().props.stepKey !== 'rating' &&
			this.getCurrentComponent().props.stepKey !== 'comments' &&
			this.getCurrentComponent().props.stepKey !== 'info'
		) {
			window.scrollTo(0, 0);
		}

		if (
			this.props.multiStepForm.navState.compState !== this.state.compState ||
			this.props.multiStepForm.navState.subCompState !== this.state.subCompState
		) {
			let nextNavState = this.props.multiStepForm.navState.progressBarState
				? this.props.multiStepForm.navState.progressBarState
				: this.state.navState;

			this.setNavState(
				this.props.multiStepForm.navState.compState,
				this.props.multiStepForm.navState.subCompState
			);

			this.setState({
				navState: nextNavState,
			});
		}

		if (hideNext && this.state.showNextBtn && this.props.multiStepForm.tastingType === 'quick') {
			this.setState({showNextBtn: false});
		}

		if (this.state.percentDone !== percentDone) {
			this.props.updateProgresbar(percentDone);
		}
	}

	renderProgressBar() {
		// TODO: bring back the progress bar after fixing the componentDidUpdate/setState infinite loop
		// ref: https://trello.com/c/Pq6xIcFW/2132-bug-2132-ntbl-web-invariant-violation-in-event-edn2dtx-dmlxrlr-swa20-dev
		return null;

		/*const {
			steps,
			multiStepForm: {navState, tastingType},
		} = this.props;
		let totalSubSteps = 0;
		let currentStep = 0;

		steps.forEach((step) => {
			if (!step.component) {
				totalSubSteps += step.subSteps.length;
			} else {
				totalSubSteps++;
			}
		});

		for (let i = 0; i <= navState.compState; i++) {
			if (!steps[i].component) {
				currentStep += i === navState.compState ? navState.subCompState : steps[i].subSteps.length;
			} else {
				currentStep += navState.compState === 0 ? 0 : 1;
			}
		}
		const totalSteps = totalSubSteps < 10 ? 10 : totalSubSteps;
		percentDone = (100 / totalSteps) * currentStep;

		if (this.state.percentDone !== percentDone) {
			this.setState({percentDone});
		}
		const addHeder = tastingSection.includes(
			`${this.getCurrentComponent().props.stepKey}-${this.getCurrentComponent().props.name}`
		);

		return (
			<>
				{addHeder && TASTINGS_TYPES_WITH_SPLASH_SCREEN.includes(tastingType) && (
					<div className="Tasting__Header">
						<L18nText id={this.getCurrentComponent().props.stepKey} />
					</div>
				)}
				<div className="ProgressBar__Wrapper">
					<div className="ProgressBar__Value" style={{width: `${percentDone}%`}} />
				</div>
			</>
		);//*/
	}

	getTitleScholar() {
		const currentComponent = this.getCurrentComponent();

		if (!currentComponent) {
			return {titleScholar: null, hideOriginalTitle: false};
		}

		const dataCurrentComponent = currentComponent.props.data;
		const isScholarTasting = this.isScholarView(this.props.multiStepForm.tastingType);

		if (!isScholarTasting || !dataCurrentComponent)
			return {titleScholar: null, hideOriginalTitle: false};

		if (dataCurrentComponent.keys && dataCurrentComponent.keys.length === 1) {
			return {titleScholar: dataCurrentComponent.keys[0], hideOriginalTitle: true};
		}

		return {
			titleScholar:
				dataCurrentComponent.title ||
				dataCurrentComponent.name ||
				currentComponent.props.name ||
				this.getTitle(),
			hideOriginalTitle: false,
		};
	}

	render() {
		const {fixedBreadcrumb, hideProgressBar, boldLastText} = this.props;
		const {titleScholar, hideOriginalTitle} = this.getTitleScholar();
		const subTitle = helpingText[titleScholar];

		return (
			<Modal
				onClose={this.onCloseModal}
				progressBar={!hideProgressBar ? this.renderProgressBar : null}
				hideOriginalTitle={hideOriginalTitle}
				title={!hideOriginalTitle ? this.getTitle() : null}
				titleScholar={titleScholar}
				subTitleScholar={subTitle}
				headerAddon={this.getCurrentHeaderAddon()}
				fixedBreadcrumb={fixedBreadcrumb}
				boldLastText={boldLastText}
				body={
					<div className="alignCenter">
						{this.state.showCloseModal && (
							<DialogBox
								title="tasting_abandon_tasting_question"
								description="tasting_abandon_tasting_confirmation"
								noCallback={this.handleNo}
								yesCallback={this.handleYes}
							/>
						)}
						<div className="multi-step-form">{this.getCurrentComponent()}</div>
					</div>
				}
				footer={<div className="alignCenter">{this.renderNavigation()}</div>}
			/>
		);
	}

	renderSteps = () => {
		return this.props.steps.map((s, i) => (
			<li className={this.getClassName('progtrckr', i)} key={i} value={i} onClick={this.jumpToStep}>
				<em>{i + 1}</em>
				<span>{this.props.steps[i].name}</span>
			</li>
		));
	};

	hideHomeBtnIfRedirectTastings = () => {
		const url = new URL(window.location.href);
		return url.searchParams.get('event') != null && url.searchParams.get('product') != null;
	};

	renderNavigation = () => {
		const {tastingType} = this.props.multiStepForm;

		const prevBtnClass = classnames('prev-btn', {
			hide: !this.state.showPreviousBtn,
		});

		const homeBtnClass = classnames('prev-btn home-btn', {
			hide: this.state.showPreviousBtn,
		});

		const nextBtnClass = classnames('next-btn', {
			hide: !this.state.showNextBtn,
		});

		const saveBtnClass = classnames('save-btn', {
			hide: !this.state.showSaveBtn,
		});

		const copyBtnClass = classnames('copy-btn', {
			copied: this.props.multiStepForm.copiedNotes,
		});

		const mobileNextClass = classnames('view-sm arrow', {
			disabled: this.state.disableNextBtn,
		});

		return (
			<div
				className="multi-step-form-nav"
				style={this.props.showNavigation ? {} : {display: 'none'}}
			>
				<div className={prevBtnClass}>
					<div className="view-lg" data-test="prevBtn">
						<Button variant="outlined" onHandleClick={this.previous} className="view-lg">
							<L18nText id="tasting_nav_back" defaultMessage="Back" />
						</Button>
					</div>
					<div className="view-sm arrow" onClick={this.previous}>
						<Back className="view-sm" />
					</div>
				</div>
				<div className={homeBtnClass} data-test="homeBtn">
					{this.hideHomeBtnIfRedirectTastings() ? null : (
						<Button variant="outlined" onHandleClick={this.navigateToHome}>
							<L18nText id={this.state.homeButtonText} defaultMessage="Home" />
						</Button>
					)}
				</div>

				{!this.isScholarView() &&
					this.getCurrentComponent() &&
					this.getCurrentComponent().props.stepKey === 'palate' &&
					this.getCurrentComponent().props.name ===
						(getStepCopyAroma[tastingType] ? getStepCopyAroma[tastingType] : 'step2') && (
						<div className={copyBtnClass} data-test="copyAromasNotesBtn">
							{this.state.isCopying ? (
								<>
									<Spinner small inline />
								</>
							) : (
								<Button onHandleClick={this.copyAromaNotes}>
									<L18nText id="tasting_copy_aroma_notes" defaultMessage="Copy all aroma notes" />
								</Button>
							)}
						</div>
					)}
				<div className={nextBtnClass}>
					<div className="view-lg" data-test="nextBtn">
						<Button onHandleClick={this.next} disabled={this.state.disableNextBtn}>
							<L18nText id="tasting_nav_next" defaultMessage="Next" />
						</Button>
					</div>
					<div className={mobileNextClass} onClick={this.next}>
						<Next />
					</div>
				</div>
				<div className={saveBtnClass} data-test="saveBtn">
					<Button onHandleClick={this.save} disabled={this.state.disableSaveBtn}>
						<L18nText id="tasting_save_button" defaultMessage="Save" />
					</Button>
				</div>
			</div>
		);
	};
}

MultiStepForm.defaultProps = {
	showNavigation: true,
};

function mapStateToProps(state) {
	return {
		activePlan: state.user.activePlan,
		multiStepForm: state.multiStepForm,
		selectedEvent: state.selectedEvent.data,
		tastingShowCaseData: state.events.tastingShowCaseData,
	};
}

const mapDispatchToProps = {
	navigateForm,
	copyAromaNotes,
	initTastingSrc,
	setEventPreventReload,
	updateProgresbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MultiStepForm));
