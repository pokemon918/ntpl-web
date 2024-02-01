import {tastingsConstants} from 'const';

export const tastingTypesWithDetailedNotes = [
	tastingsConstants.PROFOUND,
	tastingsConstants.SCHOLAR2,
	tastingsConstants.SCHOLAR3,
	tastingsConstants.SCHOLAR4,
];

const isEmpty = (obj) => {
	if (obj === undefined || obj === null || Object.keys(obj).length <= 0) {
		return true;
	}

	return false;
};

const flattenNotes = (notesLists) => Object.values(notesLists).flatMap((note) => note);

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

export const prepareFields = (formData, tastingType) => {
	// Init payload
	let payload = {};
	payload.rating = {};

	const notes = {};

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

	return payload;
};
