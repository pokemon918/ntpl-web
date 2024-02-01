import get from 'lodash/get';

import logic from 'assets/json/tasting/logic.json';
import countryRank from 'assets/json/countryRank.json';
import {multiStepFormConstants, appConstants, routeConstants, tastingsConstants} from 'const';
import {getTotalRatingPoints, signPath, escapeHtml} from 'commons/commons';
import updateBoxSelections from 'commons/updateBoxSelections';

const appVersion = require('../../package.json').version;

const tastingTypesWithDetailedNotes = [
	tastingsConstants.PROFOUND,
	tastingsConstants.SCHOLAR2,
	tastingsConstants.SCHOLAR3,
	tastingsConstants.SCHOLAR4,
];

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

const validationRules = {
	country: {description: 'tasting_country_placeholder', length: 64},
	region: {description: 'tasting_region_placeholder', length: 255},
	producer: {description: 'tasting_producer_placeholder', length: 128},
	name: {description: 'tasting_name_placeholder', length: 128},
	grape: {description: 'tasting_grape_placeholder', length: 128},
	currency: {description: 'tasting_currency_placeholder', length: 16},
	location: {description: 'tasting_location_placeholder', length: 64},
	summary_personal: {description: 'tasting_note', length: 4000},
	summary_wine: {description: 'tasting_note', length: 4000},
	food_pairing: {description: 'tasting_food_pairing', length: 4000},
};

let getSelections = (tastingSrc, propData, multiple = false, tastingType, selectedItems) => {
	let data = {};
	let activeSelection = null;
	let firstItemFound = false;

	const selections = propData.keys.map((selection, index) => {
		// Add selection as key to data for tracking
		data[selection] = {};
		data[selection].key = selection;
		data[selection].activeOption = null;
		data[selection].options = tastingSrc[selection] || [];

		if (
			selectedItems &&
			selectedItems.appearance &&
			selectedItems.appearance.winetype_ === 'category_still' &&
			selection === 'tasting_other_observation'
		) {
			data[selection] = {};
			data[selection].key = selection;
			data[selection].activeOption = null;
			data[selection].options = tastingSrc['other_observation_still_wine_'] || [];
		}

		if (multiple) {
			data[selection].activeOption = [];
		}

		if (tastingSrc && tastingSrc[selection] && !firstItemFound) {
			data[selection].isActive = true;
			activeSelection = {...data[selection]};
			firstItemFound = true;
		}

		// Set visibility for selections with "onlyifs"
		if (
			tastingType &&
			!isScholarView(tastingType) &&
			logic[selection] &&
			'onlyif' in logic[selection]
		) {
			data[selection].hideSelection = true;
		} else {
			data[selection].hideSelection = false; //show all selections by default
		}

		if (
			selection === 'color_' &&
			(tastingType === 'scholar2' ||
				tastingType === 'scholar2m' ||
				tastingType === 'scholar3' ||
				tastingType === 'scholar3m' ||
				tastingType === 'scholar4' ||
				tastingType === 'scholar4m')
		) {
			data[selection] = {};
			data[selection].key = selection;
			data[selection].activeOption = null;
			data[selection].options = tastingSrc['color_'] || [];
			data[selection].hideSelection = false; //show all selections by default
		}

		return data[selection];
	});

	return {
		selections,
		activeSelection,
	};
};

let isEmpty = (obj) => {
	if (obj === undefined || obj === null || Object.keys(obj).length <= 0) {
		return true;
	}

	return false;
};

const getNotesFrom = (obj) => {
	const notes = [];
	Object.keys(obj).forEach((item) => {
		if (obj[item] && obj[item].constructor === Array) {
			obj[item].forEach((innerItem) => notes.push(innerItem));
		} else {
			notes.push(obj[item]);
		}
	});
	return notes;
};

const flattenNotes = (notesLists) =>
	Object.values(notesLists)
		.flatMap((note) => note)
		.filter(Boolean);

let prepareFields = (formData, tastingType) => {
	// Init payload
	let payload = {};

	const notes = {};
	const metadata = {};
	const info = {};

	// Prepare tasting info
	if (!isEmpty(formData.info)) {
		payload.country_key = getCountryKey(formData.info);
		payload.producer = formData.info.tasting_producer;
		payload.name = formData.info.tasting_name;
		payload.region = formData.info.tasting_region.trim();
		payload.region_key = formData.info.tasting_region_key;
		payload.vintage =
			formData.info.tasting_vintage === 'Non Vintage' ? null : formData.info.tasting_vintage;
		payload.grape = formData.info.tasting_grape;
		payload.price = formData.info.tasting_price;
		payload.currency = formData.info.tasting_currency;
	}

	if (
		formData.info.bottlebook_product_id != null &&
		formData.info.bottlebook_event_id != null &&
		formData.info.bottlebook_client_id != null &&
		formData.info.bottlebook_producer_id != null
	) {
		payload.fkey = {
			origin: 'BB',
			subject_key: formData.info.bottlebook_product_id,
			event_key: formData.info.bottlebook_event_id,
			client_key: formData.info.bottlebook_client_id,
			producer_key: formData.info.bottlebook_producer_id,
		};
	}

	if (!isEmpty(formData.collection)) {
		payload.collection = formData.collection.id;
		payload.mold = formData.collection.mold;
	}

	// Prepare summary
	if (!isEmpty(formData.comments)) {
		payload.summary_wine = formData.comments.wine_summary || formData.comments.tastingNote;
		payload.summary_personal = formData.comments.wine_personal;
		payload.location = formData.comments.personal_location;
		payload.food_pairing = formData.comments.food_pairing;

		if (tastingType !== tastingsConstants.SWA20) {
			info.drinkability = formData.comments.rating_drinkability_;
			info.maturity = formData.comments.rating_maturity_;
		}
	}

	// Prepare rating
	if (!isEmpty(formData.rating) && tastingType !== tastingsConstants.SWA20) {
		payload.rating = {};
		payload.rating.version = 1; // where should this come from?
		payload.rating.final_points = getTotalRatingPoints(formData.rating);
		payload.rating.balance = formData.rating.rating_balance_;
		payload.rating.length = formData.rating.rating_finish__;
		payload.rating.intensity = formData.rating.rating_intensity__;
		payload.rating.terroir = formData.rating.rating_terroir_ || 0;
		payload.rating.complexity = formData.rating.rating_complexity_;
		payload.rating.maturity = formData.comments.rating_maturity_;

		// duplicate rating values on info
		info.parker_blind = payload.rating.final_points;
		info.balance = payload.rating.balance;
		info.finish = payload.rating.length;
		info.intensity = payload.rating.intensity;
		info.typicity = payload.rating.terroir;
		info.complexity = payload.rating.complexity;
		info.maturity = payload.rating.maturity;
	}

	// Ratings of tasting type swa20 must be sent on metadata instead
	if (!isEmpty(formData.rating) && tastingType === tastingsConstants.SWA20) {
		info.parker_blind = getTotalRatingPoints({
			...formData.rating,
			rating_terroir_: formData.rating.rating_typicity_,
		});
		info.balance = formData.rating.rating_balance_;
		info.finish = formData.rating.rating_finish__;
		info.intensity = formData.rating.rating_intensity__;
		info.complexity = formData.rating.rating_complexity_;
		info.typicity = formData.rating.rating_typicity_;
		info.drinkability = formData.rating.rating_drinkability_;
		info.maturity = formData.rating.rating_maturity_;
		info.value_for_money = formData.rating.rating_value_for_money_;
	}

	if (!isEmpty(formData.mineralities)) {
		notes.mineralities = getNotesFrom(formData.mineralities);
	}

	// Prepare notes from Appearance, Nose, Palate and Observations
	if (!isEmpty(formData.appearance)) {
		if (
			formData.appearance.winetype_ === 'winetype_fortified_sherry' &&
			formData.appearance.color_ === 'color_oxidative_aged'
		) {
			notes.appearance = ['type_sherry_deloxi'];
		}

		if (
			formData.appearance.winetype_ === 'winetype_fortified_sherry' &&
			formData.appearance.color_ === 'color_biological_aged'
		) {
			notes.appearance = ['type_sherry_bio'];
		}

		if (!notes.appearance) {
			notes.appearance = getNotesFrom(formData.appearance);
		}
	}

	if (!isEmpty(formData.nose)) {
		notes.nose = getNotesFrom(formData.nose);
	}

	if (!isEmpty(formData.palate)) {
		notes.palate = getNotesFrom(formData.palate);
	}

	if (!isEmpty(formData.characteristics)) {
		notes.characteristics = getNotesFrom(formData.characteristics);
	}

	if (!isEmpty(formData.observations)) {
		notes.observations = getNotesFrom(formData.observations);
	}

	if (!isEmpty(formData.medal)) {
		const [medalType, ...medalValue] = formData.medal.selectedMedal.split('_');
		if (medalType) {
			info[medalType] = medalValue.join('_');
		}
	}

	if (!isEmpty(formData.event)) {
		metadata.swa_round_2 = formData.event.swa_round_2;
	}

	if (!isEmpty(get(formData, 'descriptors_other.notes_input_other'))) {
		metadata.notes_input_other = formData.descriptors_other.notes_input_other;
	}

	if (!isEmpty(metadata)) {
		payload.metadata = JSON.stringify(metadata);
	}

	if (!isEmpty(info)) {
		payload.info = info;
	}

	if (tastingTypesWithDetailedNotes.includes(tastingType)) {
		const {nose, palate, ...others} = notes;
		payload.notes = {
			'@': flattenNotes(others),
			nose,
			palate,
		};
	} else {
		payload.notes = {'@': flattenNotes(notes)};
	}
	payload.source = `${tastingType}/web/${appVersion}`;

	return payload;
};

/**
 * @param {*} info { tasting_country_key: '', tasting_country: '' }
 */
export function getCountryKey(info = {}) {
	function findBy(field, value = '') {
		const valueOf = (field, item = {}) => item[field] || '';
		const lower = (str) => str.toLowerCase();
		const matches = (item) => lower(valueOf(field, item)) === lower(value);
		const country = countryRank.find(matches);
		return country ? country.id : '';
	}
	return findBy('id', info.tasting_country_key) || findBy('name', info.tasting_country);
}

export function initTastingSrc(tastingSrc) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_TASTING_SOURCE,
			payload: tastingSrc,
		});
	};
}

export function initStepData(
	tastingSrc,
	step,
	rawStepData,
	isSubStep = false,
	name = null,
	tastingType,
	selectedItems
) {
	let stepData = getSelections(tastingSrc, rawStepData, false, tastingType, selectedItems);
	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_STEP_DATA,
			payload: payload,
		});
	};
}

export function initEventTasting(
	selectedData,
	tastingSrc,
	step,
	rawStepData,
	isSubStep = false,
	name = null
) {
	let stepData = getSelections(tastingSrc, rawStepData);

	Object.keys(selectedData).forEach((key) => {
		markSelectedItems(tastingSrc, key, selectedData[key], stepData);
	});

	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_STEP_DATA,
			payload: payload,
		});
	};
}

function markSelectedItems(tastingSrc, selectionKey, value, stepData) {
	let {selections, activeSelection} = stepData;
	activeSelection.isActive = false; // set the previous active selection to false

	// set active selection
	selections.forEach((selection, index) => {
		if (selection.key === selectionKey) {
			selection.isActive = true;
			selection.activeOption = value;
			activeSelection = selection;
		}
	});

	updateBoxSelections(null, tastingSrc, selectionKey, selections, activeSelection);

	console.log('MARKING SELECTED ITEMS...');
}

export function updateStepSelections(step, stepData, isSubStep = false, name = null) {
	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
			name,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.UPDATE_STEP_SELECTIONS,
			payload: payload,
		});
	};
}

export function copyAromaNotes(aromaNotes, step, name, tastingType) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.COPY_AROMA_NOTES,
			payload: {
				aromaNotes,
				step,
				name,
				tastingType,
			},
		});
	};
}

export function updateSelectedItem(step, stepData) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.UPDATE_SELECTED_ITEM,
			payload: {
				step,
				stepData,
			},
		});
	};
}

export function presetInfo(data) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.PRESET_INFO,
			payload: {
				data,
			},
		});
	};
}

export function updateProgresbar(payload) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.UPDATE_PROGRESSBAR,
			payload,
		});
	};
}

export function navigateForm(compState, subCompState, progressBarState, navButtons) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.NAVIGATE_FORM,
			payload: {
				compState,
				subCompState,
				progressBarState,
				navButtons,
			},
		});
	};
}

export function removeSelectedItem(step, itemKey, isSubStep = false, name = null) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.REMOVE_SELECTED_ITEM,
			payload: {
				step,
				itemKey,
				isSubStep,
				name,
			},
		});
	};
}

export function submitForm(formData, isOnline, url, history) {
	for (let key in formData.info) {
		if (key !== 'tasting_vintage') {
			formData.info[key] = formData.info[key] ? escapeHtml(formData.info[key]) : '';
		}
	}
	for (let key in formData.comments) {
		if (key === 'personal_location' || key === 'tastingNote' || key === 'wine_personal') {
			formData.comments[key] = formData.comments[key] ? escapeHtml(formData.comments[key]) : '';
		}
	}

	const payload = prepareFields(formData, url);
	const {impressionRef} = formData;

	return async (dispatch) => {
		const isValid = validationCheck(payload, dispatch, url);
		const isEditing = !!impressionRef;
		const endpoint = isEditing ? `/tasting/${impressionRef}` : '/tasting';
		const signedPath = await signPath(endpoint, 'POST');

		if (isValid) {
			dispatch({type: multiStepFormConstants.SUBMIT_START});
			try {
				dispatch({
					type: multiStepFormConstants.SUBMIT_FULFILLED,
					payload: {
						...payload,
						isOnline,
						ref: 'new',
						loadingText: 'tasting_saving',
					},
					meta: {
						offline: {
							// the network action to execute:
							effect: {url: signedPath, method: 'POST', json: {...payload}},
							// action to dispatch when effect succeeds:
							commit: {
								type: `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`,
							},
							// action to dispatch if network action fails permanently:
							rollback: {
								type: `${appConstants.OPEN_APP_ERROR_MODAL}`,
								error: {
									request: {
										path: signedPath,
										options: {method: 'POST'},
										data: payload,
										url: routeConstants.MY_TASTINGS,
									},
									status: 'Exception',
									meta: {
										history,
									},
								},
							},
						},
					},
				});

				return true;
			} catch (err) {
				dispatch({
					type: appConstants.SERVER_ERROR,
					error: {
						request: {
							path: signedPath,
							options: {method: 'POST'},
							data: payload,
							url: routeConstants.MY_TASTINGS,
						},
						status: 'Exception',
					},
				});

				return false;
			}
		}

		return false;
	};
}

export function navigateAway(lastSessionType) {
	return async (dispatch) => {
		dispatch({
			type: multiStepFormConstants.NAVIGATE_AWAY,
			payload: {lastSessionType: lastSessionType},
		});
	};
}

export function resetForm() {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESET_FORM});
	};
}

export function restartSession() {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESTART_SESSION});
	};
}

export function resetSession() {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESET_SESSION});
	};
}

export function restoreSession(type) {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESTORE_SESSION, payload: {tastingType: type}});
	};
}

export function setTastingType(type, restart = false) {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.SET_TASTING_TYPE, payload: {tastingType: type}});

		// Restart tasting if new tasting is selected.
		if (restart) {
			dispatch({type: multiStepFormConstants.RESTART_SESSION});
		}
	};
}

export function eventTastingInitStep(secondStep = false) {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.EVENT_TASTING_INIT_STEP, payload: secondStep});
	};
}

export function selectImpressionForEditing(data) {
	return async (dispatch) => {
		dispatch({
			type: multiStepFormConstants.SELECT_IMPRESSION_FOR_EDITING,
			payload: {data},
		});
	};
}

function errorDispatch(dispatch, payload, afterSaveUrl) {
	dispatch({
		type: multiStepFormConstants.SUBMIT_ERROR,
		payload: {
			data: null,
			error: true,
			afterSaveUrl: afterSaveUrl
				? `${routeConstants.TASTING}/${afterSaveUrl}`
				: `${routeConstants.TASTING}`,
			loadingText: 'tasting_error_save_data',
		},
	});
}

function validationCheck(payload, dispatch, afterSaveUrl) {
	let isValid = true;

	Object.keys(payload).forEach((field) => {
		const lengthRule =
			validationRules.hasOwnProperty(field) && validationRules[field].hasOwnProperty('length')
				? validationRules[field].length
				: 0;

		if (
			lengthRule &&
			typeof payload[field] === 'string' &&
			validateCharacterLength(payload[field], lengthRule)
		) {
			dispatch({
				type: appConstants.OPEN_APP_ERROR_MODAL,
				payload: {
					message: 'tasting_error_field_length_invalid',
					additionalData: {
						field: validationRules[field].description || field,
						maxlength: lengthRule,
					},
				},
			});
			isValid = false;

			errorDispatch(dispatch, payload, afterSaveUrl);
		}
	});

	return isValid;
}

function validateCharacterLength(text, maxLength) {
	const DEFAULT_MAX_FIELD_LENGTH = 127;

	if (
		(maxLength && text.length > maxLength) ||
		(!maxLength && text.length > DEFAULT_MAX_FIELD_LENGTH)
	) {
		return true;
	}

	return false;
}
