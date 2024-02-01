import {TastingSetupParameters} from './types';

import tasting from 'config/tasting';

import notes from 'assets/json/tasting/swa20/nose.json';
import observationsData from 'assets/json/tasting/swa20/observations.json';
import redStillNotes from 'assets/json/tasting/swa20/still/redNotes.json';
import orangeStillNotes from 'assets/json/tasting/swa20/still/orangeNotes.json';
import roseStillNotes from 'assets/json/tasting/swa20/still/roseNotes.json';
import characteristics from 'assets/json/tasting/swa20/characteristics.json';
import sherryCharacteristics from 'assets/json/tasting/swa20/sherry_characteristics.json';
import whiteStillNotes from 'assets/json/tasting/swa20/still/whiteNotes.json';
import redSparklingNotes from 'assets/json/tasting/swa20/sparkling/redNotes.json';
import orangeSparklingNotes from 'assets/json/tasting/swa20/sparkling/orangeNotes.json';
import roseSparklingNotes from 'assets/json/tasting/swa20/sparkling/roseNotes.json';
import whiteSparklingNotes from 'assets/json/tasting/swa20/sparkling/whiteNotes.json';
import fortifiedPortRedNotes from 'assets/json/tasting/swa20/fortified/port/redNotes.json';
import fortifiedPortWhiteNotes from 'assets/json/tasting/swa20/fortified/port/whiteNotes.json';
import fortifiedPortDefaultNotes from 'assets/json/tasting/swa20/fortified/port/defaultNotes.json';
import fortifiedSherryWhiteNotes from 'assets/json/tasting/swa20/fortified/sherry/whiteNotes.json';

interface SWA20TastingArguments {
	wineType: string;
	wineColor: string;
}

export default function getTastingSetup(data: SWA20TastingArguments): TastingSetupParameters {
	const {wineType, wineColor} = data;
	const tastingSrc = tasting.source.swa20;

	return {
		tastingSrc,
		steps: {
			nose: getNoseData(wineColor, wineType),
			characteristics: getCharacteristicsData(wineType),
			observations: observationsData,
		},
	};
}

function getNoseData(color: string, type: string) {
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
}

function getCharacteristicsData(type: string) {
	if (type === 'winetype_fortified_sherry') {
		return sherryCharacteristics;
	}

	return characteristics;
}
