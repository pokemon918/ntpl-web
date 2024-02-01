import storage from 'redux-persist/lib/storage';

import {filterByLogic, getSelectedItemsFromImpression, getStepsFromImpression} from './functions';
import {multiStepFormConstants, appConstants, eventsConstants} from 'const';

/*
function saveFormData(multiStepFormObj) {
	// Persist in localstorage
	localStorage.setItem('multiStepForm', JSON.stringify(multiStepFormObj));
}

function recoverFormData() {
	return JSON.parse(localStorage.getItem('multiStepForm'));
}
*/

const isScholarView = (tastingType) => {
	return (
		tastingType === 'scholar2' ||
		tastingType === 'scholar2m' ||
		tastingType === 'scholar3' ||
		tastingType === 'scholar3m' ||
		tastingType === 'scholar4' ||
		tastingType === 'scholar4m'
	);
};

const defaultData = {
	steps: {},
	selectedItems: {},
	navState: {
		compState: 0,
		subCompState: 0,
		progressBarState: null,
		navButtons: {
			showPreviousBtn: false,
			showNextBtn: true,
			showSaveBtn: false,
			disableNextBtn: false,
			disableSaveBtn: true,
		},
	},
	progressPercent: 0,
	status: {},
	copiedNotes: false,
	resetScroll: false,
	error: null,
	tastingSrc: null,
	mode: 'form',
	isLoading: false,
	navigatedAway: false,
	tastingType: null,
	lastSessionType: null,
	lastSessionData: {},
	isEventTastingInit: false,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case multiStepFormConstants.INIT_STEP_DATA: {
			if (action.payload.isSubStep) {
				let newSteps = Object.assign({}, state.steps);
				let newSelectedItems = Object.assign({}, state.selectedItems);

				if (newSteps[action.payload.step] && newSteps[action.payload.step].subSteps) {
					newSteps[action.payload.step] = {
						subSteps: Object.assign(
							{},
							newSteps[action.payload.step].subSteps,
							action.payload.subSteps
						),
						isSubStep: action.payload.isSubStep,
					};
				} else {
					newSteps[action.payload.step] = {
						subSteps: action.payload.subSteps,
						isSubStep: action.payload.isSubStep,
					};
				}

				Object.keys(newSteps[action.payload.step].subSteps).forEach((key) => {
					filterByLogic(
						action.payload.step,
						newSteps[action.payload.step].subSteps[key].data,
						newSelectedItems,
						state.tastingType
					);
				});

				let data = Object.assign({}, state, {steps: newSteps, mode: 'form'});

				return data;
			} else {
				let newSteps = Object.assign({}, state.steps);
				let newSelectedItems = Object.assign({}, state.selectedItems);

				newSteps[action.payload.step] = {
					stepData: action.payload.stepData,
					isSubStep: action.payload.isSubStep,
				};

				filterByLogic(
					action.payload.step,
					newSteps[action.payload.step].stepData,
					newSelectedItems,
					state.tastingType
				);

				let data = Object.assign({}, state, {steps: newSteps, mode: 'form'});
				return data;
			}
		}
		case multiStepFormConstants.UPDATE_STEP_SELECTIONS: {
			if (action.payload.isSubStep) {
				let newSteps = Object.assign({}, state.steps);
				let newSelectedItems = Object.assign({}, state.selectedItems);
				let selections = action.payload.subSteps[action.payload.name].data.selections;

				if (newSteps[action.payload.step] && newSteps[action.payload.step].subSteps) {
					newSteps[action.payload.step] = {
						subSteps: Object.assign(
							{},
							newSteps[action.payload.step].subSteps,
							action.payload.subSteps
						),
						isSubStep: action.payload.isSubStep,
					};
				} else {
					newSteps[action.payload.step] = {
						subSteps: action.payload.subSteps,
						isSubStep: action.payload.isSubStep,
					};
				}

				// Build selected items
				if (
					newSelectedItems[action.payload.step] === undefined ||
					newSelectedItems[action.payload.step] === null
				) {
					newSelectedItems[action.payload.step] = {};
				}

				selections.forEach((selection) => {
					if (selection.activeOption !== null) {
						newSelectedItems[action.payload.step][selection.key] = selection.activeOption;
					}
				});

				// Check if user went back to nose and made some changes (functionality for 'copy aroma notes' button)
				let copiedNotes = state.copiedNotes;
				if (copiedNotes && action.payload.step === 'nose' && action.payload.name !== 'step1') {
					copiedNotes = false;
				}
				// Reset notes value if color is changed for quick tasting.
				if (action.payload.step === 'appearance' && state.tastingType === 'quick') {
					delete newSteps.nose;
				}

				let data = Object.assign({}, state, {
					steps: newSteps,
					selectedItems: newSelectedItems,
					copiedNotes: copiedNotes,
					resetScroll: false,
				});

				return data;
			} else {
				let newSteps = Object.assign({}, state.steps);
				let newSelectedItems = Object.assign({}, state.selectedItems);
				let selections = action.payload.stepData.selections;

				newSteps[action.payload.step] = {
					stepData: action.payload.stepData,
					isSubStep: action.payload.isSubStep,
				};

				// checks if the options of this selection are based from the value of another selection
				if (action.payload.stepData.activeSelection) {
					const activeKey = action.payload.stepData.activeSelection.key;
					const activeBasedFrom = state.tastingSrc[`${activeKey}_based_from`];
					if (activeBasedFrom) {
						const activeBasedSelection = action.payload.stepData.selections.find(
							(selection) => selection.key === activeBasedFrom
						);
						if (activeBasedSelection && activeBasedSelection.activeOption) {
							const activeBasedOptions = state.tastingSrc[activeBasedSelection.activeOption];
							const activeBasedValue = activeBasedOptions || [];
							newSteps[action.payload.step].stepData.activeSelection.options = activeBasedValue;

							const {activeOption} = newSteps[action.payload.step].stepData.activeSelection;
							if (!activeBasedValue.includes(activeOption)) {
								newSteps[action.payload.step].stepData.activeSelection.activeOption = null;
							}
						}
					}
				}

				// Build selected items
				if (
					newSelectedItems[action.payload.step] === undefined ||
					newSelectedItems[action.payload.step] === null
				) {
					newSelectedItems[action.payload.step] = {};
				}

				selections.forEach((selection) => {
					newSelectedItems[action.payload.step][selection.key] = selection.activeOption;
				});

				let data = Object.assign({}, state, {
					steps: newSteps,
					selectedItems: newSelectedItems,
					resetScroll: false,
				});

				return data;
			}
		}

		case multiStepFormConstants.SELECT_IMPRESSION_FOR_EDITING: {
			const impressionData = action.payload.data;
			const steps = getStepsFromImpression(impressionData);
			const selectedItems = getSelectedItemsFromImpression(impressionData);
			return {
				...state,
				steps,
				selectedItems,
			};
		}

		case multiStepFormConstants.COPY_AROMA_NOTES: {
			let newSteps = Object.assign({}, state.steps);
			let newSelectedItems = Object.assign({}, state.selectedItems);
			let noseSubSteps = {};
			let palateSubSteps = newSteps[action.payload.step].subSteps;
			let copiedNotes = true;

			if (newSteps.nose && newSteps.nose.subSteps) {
				noseSubSteps = newSteps.nose.subSteps;
			}

			/****** Handle multiStepForm selectedItems *****/
			if (
				newSelectedItems[action.payload.step] === undefined ||
				newSelectedItems[action.payload.step] === null
			) {
				newSelectedItems[action.payload.step] = {};
			}

			if (newSelectedItems[action.payload.step]) {
				Object.keys(action.payload.aromaNotes).forEach((key) => {
					if (newSelectedItems[action.payload.step][key]) {
						newSelectedItems[action.payload.step][key] = Array.from(
							new Set(
								newSelectedItems[action.payload.step][key].concat(action.payload.aromaNotes[key])
							)
						);
					} else {
						newSelectedItems[action.payload.step][key] = Array.from(
							new Set([].concat(action.payload.aromaNotes[key]))
						);
					}
				});
			} else {
				newSelectedItems[action.payload.step] = Object.assign({}, action.payload.aromaNotes);
			}
			/************************* end of handling selected items ************************/

			/****** Handle substeps selections and activeOptions *****/
			Object.keys(noseSubSteps).forEach((key) => {
				let profoundKey = key;

				// profound mobile tasting always has a single selection on each substep
				// so we have to find the index of the palate substep that's equivalent to the current nose substep
				if (
					action.payload.tastingType === 'profoundMobile' ||
					action.payload.tastingType === 'scholar2m' ||
					action.payload.tastingType === 'scholar3m' ||
					action.payload.tastingType === 'scholar4m'
				) {
					const [noseSelection] = noseSubSteps[key].data.selections;
					const noseKey = noseSelection && noseSelection.key;
					profoundKey = Object.keys(palateSubSteps).find((subStepKey) => {
						const subStepInfo = palateSubSteps[subStepKey];
						if (!subStepInfo || !subStepInfo.data || !subStepInfo.data.selections) {
							return false;
						}
						return !!subStepInfo.data.selections.find((selection) => selection.key === noseKey);
					});
				}

				if (profoundKey !== 'step1') {
					// Check if the palate substep already exists
					if (palateSubSteps[profoundKey] && palateSubSteps[profoundKey].data) {
						let palateSelections = palateSubSteps[profoundKey].data.selections;
						let noseSelections = noseSubSteps[key].data.selections;

						// Make sure to merge all selections from nose substep selections with palate substep selections
						noseSelections.forEach((selection) => {
							const index = palateSelections.findIndex((i) => i.key === selection.key);
							if (selection.activeOption && palateSelections[index]) {
								if (palateSelections[index].activeOption) {
									palateSelections[index].activeOption = Array.from(
										new Set(selection.activeOption.concat(palateSelections[index].activeOption))
									);
								} else {
									palateSelections[index].activeOption = Array.from(
										new Set([].concat(selection.activeOption))
									);
								}
							}
						});
						let firstSelection = palateSubSteps[profoundKey].data.selections[0];
						palateSubSteps[profoundKey].data.activeSelection = firstSelection;
						firstSelection.isActive = true;
					} else {
						// If palate subStep doesn't exist, simply copy what's on nose subStep
						palateSubSteps[profoundKey] = JSON.parse(JSON.stringify(noseSubSteps[key]));

						// Reset isActive for all selections to false
						palateSubSteps[profoundKey].data.selections.forEach(
							(selection) => (selection.isActive = false)
						);

						// Set the first selection to be the activeSelection
						let firstSelection = palateSubSteps[profoundKey].data.selections[0];
						palateSubSteps[profoundKey].data.activeSelection = firstSelection;
						firstSelection.isActive = true;
					}
				}
			});
			/************************* end of handling substeps selections and activeOptions ************************/

			let data = Object.assign({}, state, {
				selectedItems: newSelectedItems,
				steps: newSteps,
				copiedNotes: copiedNotes,
			});

			// saveFormData(data);

			return data;
		}
		case multiStepFormConstants.UPDATE_SELECTED_ITEM: {
			let newSelectedItems = Object.assign({}, state.selectedItems);

			if (action.payload.step in newSelectedItems) {
				newSelectedItems[action.payload.step] = Object.assign(
					{},
					newSelectedItems[action.payload.step],
					action.payload.stepData
				);
			} else {
				newSelectedItems[action.payload.step] = Object.assign({}, action.payload.stepData);
			}

			let data = Object.assign({}, state, {selectedItems: newSelectedItems});
			return data;
		}
		case multiStepFormConstants.PRESET_INFO: {
			return Object.assign({}, state, {selectedItems: action.payload.data});
		}
		case multiStepFormConstants.UPDATE_PROGRESSBAR: {
			let data = Object.assign({}, state, {
				progressPercent: action.payload,
			});

			return data;
		}

		case multiStepFormConstants.REMOVE_SELECTED_ITEM: {
			let newSteps = Object.assign({}, state.steps);
			let newSelectedItems = Object.assign({}, state.selectedItems);

			if (
				action.payload.step in newSelectedItems &&
				newSelectedItems[action.payload.step][action.payload.itemKey]
			) {
				delete newSelectedItems[action.payload.step][action.payload.itemKey];
			}

			if (action.payload.isSubStep) {
				let selections =
					newSteps[action.payload.step].subSteps[action.payload.name].data.selections;
				// let activeSelection = newSteps[action.payload.step].subSteps[action.payload.name].data.activeSelection;

				// Loop through all selections and set isActive to false for the item
				selections.forEach((selection) => {
					if (selection.key === action.payload.itemKey) {
						selection.isActive = false;
					}
				});

				// Set activeSelection to null
				// activeSelection = null;
			} else {
				let selections = newSteps[action.payload.step].stepData.selections;
				// let activeSelection = newSteps[action.payload.step].stepData.activeSelection;

				// Loop through all selections and set isActive to false for the item
				selections.forEach((selection) => {
					if (selection.key === action.payload.itemKey) {
						selection.isActive = false;
					}
				});

				// Set activeSelection to null
				// activeSelection = null;
			}

			let data = Object.assign({}, state, {steps: newSteps, selectedItems: newSelectedItems});
			return data;
		}

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`: {
			storage.removeItem('multiStepForm');
			return defaultData;
		}

		case multiStepFormConstants.SUBMIT_FULFILLED: {
			if (!action.payload.isOnline) {
				return defaultData;
			}

			return {...state};
		}

		case multiStepFormConstants.SUBMIT_ERROR: {
			let data = Object.assign({}, state, {error: action.payload.error});
			return data;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}
		case multiStepFormConstants.INIT_TASTING_SOURCE: {
			let data = Object.assign({}, state, {tastingSrc: action.payload});
			return data;
		}
		case multiStepFormConstants.NAVIGATE_FORM: {
			const totalDoneCount =
				action.payload.progressBarState &&
				action.payload.progressBarState.styles.filter((status) => status === 'done').length;
			const totalStatusCount = action.payload.progressBarState
				? action.payload.progressBarState.styles.length || 0
				: 0;

			if (totalStatusCount !== totalDoneCount) {
				let newSteps = Object.assign({}, state.steps);
				let newSelectedItems = Object.assign({}, state.selectedItems);

				if (!isScholarView(state.tastingType)) {
					Object.keys(newSteps).forEach((stepKey) => {
						let step = newSteps[stepKey];
						if (step.isSubStep) {
							let subSteps = step.subSteps;
							Object.keys(subSteps).forEach((subStepKey) => {
								filterByLogic(
									stepKey,
									subSteps[subStepKey].data,
									newSelectedItems,
									state.tastingType
								);
							});
						} else {
							filterByLogic(stepKey, step.stepData, newSelectedItems, state.tastingType);
						}
					});
				}

				let data = Object.assign({}, state, {
					steps: newSteps,
					selectedItems: newSelectedItems,
					resetScroll: true,
					navState: {
						compState: action.payload.compState,
						subCompState: action.payload.subCompState,
						progressBarState: action.payload.progressBarState,
						navButtons: action.payload.navButtons,
					},
				});

				return data;
			}

			return state;
		}
		case eventsConstants.SET_TASTING_SHOWCASE_DATA: {
			let data = Object.assign({}, state, {mode: 'showcase'});
			return data;
		}
		case multiStepFormConstants.SET_TASTING_TYPE: {
			let data = Object.assign({}, state, {tastingType: action.payload.tastingType});
			return data;
		}
		case multiStepFormConstants.NAVIGATE_AWAY: {
			let currentSessionType = action.payload.lastSessionType;
			let sessionData = Object.assign({}, state.lastSessionData);

			if (Object.keys(state.selectedItems).length) {
				sessionData[currentSessionType] = Object.assign({}, state);
			}

			let data = Object.assign({}, defaultData, {
				navigatedAway: true,
				lastSessionType: currentSessionType,
				lastSessionData: sessionData,
			});
			return data;
		}
		case multiStepFormConstants.RESTART_SESSION: {
			const lastSessionData = Object.assign({}, state.lastSessionData);
			delete lastSessionData[state.tastingType];

			return {
				...defaultData,
				tastingSrc: state.tastingSrc,
				tastingType: state.tastingType,
				lastSessionData: {...lastSessionData},
			};
		}

		case multiStepFormConstants.RESTORE_SESSION: {
			if (action.payload.tastingType && state.lastSessionData[action.payload.tastingType]) {
				let sessionData = Object.assign({}, state.lastSessionData[action.payload.tastingType], {
					lastSessionData: state.lastSessionData,
				});
				// After successful restore, reset the session data for the current tasting type
				delete sessionData.lastSessionData[action.payload.tastingType];
				let data = Object.assign({}, sessionData);
				return data;
			}

			let data = Object.assign({}, defaultData, {tastingSrc: state.tastingSrc});
			return data;
		}
		case multiStepFormConstants.RESET_FORM: {
			let data = Object.assign({}, defaultData);
			return data;
		}
		case multiStepFormConstants.EVENT_TASTING_INIT_STEP: {
			return {
				...state,
				isEventTastingInit: action.payload,
			};
		}
		case multiStepFormConstants.RESET_SESSION: {
			const lastSessionData = Object.assign({}, state.lastSessionData);
			delete lastSessionData[state.tastingType];

			if (
				state.steps.appearance &&
				state.steps.appearance.subSteps &&
				state.steps.appearance.subSteps.step1
			) {
				return {
					...defaultData,
					steps: {
						...state.steps,
						appearance: {
							...state.steps.appearance,
							subSteps: {
								step1: {
									...state.steps.appearance.subSteps.step1,
									data: {
										selections: [
											{
												...state.steps.appearance.subSteps.step1.data.selections,
												activeOption: null,
												isActive: true,
											},
										],
										activeSelection: {
											...state.steps.appearance.subSteps.step1.data.activeSelection,
											activeOption: null,
											isActive: true,
										},
									},
								},
							},
						},
					},
					mode: 'form',
					isEventTastingInit: true,
					tastingSrc: state.tastingSrc,
					tastingType: state.tastingType,
					lastSessionData: {...lastSessionData},
				};
			}

			return {
				...defaultData,
				mode: 'form',
				isEventTastingInit: true,
				tastingSrc: state.tastingSrc,
				tastingType: state.tastingType,
				lastSessionData: {...lastSessionData},
			};
		}
		default:
			return state;
	}
}
