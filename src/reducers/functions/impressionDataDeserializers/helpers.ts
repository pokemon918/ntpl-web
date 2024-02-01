import {ImpressionData, ImpressionNotes} from './types';

export function getGeneralNotes(notes: ImpressionNotes = {}) {
	return notes['@'] ?? [];
}

export function filterNotes(prefix: string) {
	return function filterEachNote(note: string) {
		return note.startsWith(prefix);
	};
}
export function createNotesFinder(notes: string[]) {
	return function findNode(prefix: string) {
		return notes.find(filterNotes(prefix)) ?? '';
	};
}

export function getSelectedTrophy(data: ImpressionData) {
	const medal = data.info?.medal;
	if (medal) {
		return `medal_${medal}`;
	}

	const recommendation = data.info?.recommendation;
	if (recommendation) {
		return `recommendation_${recommendation}`;
	}

	return '';
}

export function hasMedalPage(data: ImpressionData) {
	return data.info?.medal ? true : false;
}
