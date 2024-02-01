import {contestConstants} from 'const';

const re = {
	d1: /(^|[^\d])(\d{1})([^\d]|$)/g,
	d2: /(^|[^\d])(\d{2})([^\d]|$)/g,
	d3: /(^|[^\d])(\d{3})([^\d]|$)/g,
	nonLatin: /[\u0300-\uF8FF]+/g,
};

export const getCurrentUserRole = (relations: any) => {
	if (!Array.isArray(relations)) {
		return contestConstants.relation.NOT_LOADED;
	}

	if (
		relations.includes(contestConstants.relation.OWNER) ||
		relations.includes(contestConstants.relation.ADMIN)
	) {
		return contestConstants.relation.OWNER;
	}

	if (relations.includes(contestConstants.relation.LEADER)) {
		return contestConstants.relation.LEADER;
	}

	if (
		relations.includes(contestConstants.relation.MEMBER) ||
		relations.includes(contestConstants.relation.GUIDE)
	) {
		return contestConstants.relation.MEMBER;
	}

	if (relations.includes(contestConstants.relation.PARTICIPANT)) {
		return contestConstants.relation.PARTICIPANT;
	}

	if (relations.includes(contestConstants.relation.REQUESTED_PARTICIPANT)) {
		return contestConstants.relation.REQUESTED_PARTICIPANT;
	}

	return contestConstants.relation.NONE;
};

export const sortByName = (a: any, b: any) => {
	a = a.name || a.data?.name;
	a = a
		?.toLowerCase()
		.replace(/ /g, '')
		.replace(re.d1, '$10$2$3')
		.replace(re.d2, '$10$2$3')
		.replace(re.d3, '$10$2$3');

	b = b.name || b.data?.name;
	b = b
		?.toLowerCase()
		.replace(/ /g, '')
		.replace(re.d1, '$10$2$3')
		.replace(re.d2, '$10$2$3')
		.replace(re.d3, '$10$2$3');

	if (a < b) return -1;

	if (b < a) return 1;

	return 0;
};

export const text2latin = (str: String, append = false) => {
	return (
		(append ? str + String.fromCharCode(30) : '') + str.normalize('NFKD').replace(re.nonLatin, '')
	).toLowerCase();
};

let cache: any = {
	text2latin: {},
	isTextInText: {},
};
export const isTextInText = (needle: string, haystack: string) => {
	let result = cache.isTextInText[needle + haystack];
	if (!result) {
		cache.isTextInText[needle + haystack] = text2latin(haystack, true).includes(
			needle.toLowerCase().trim()
		)
			? 1
			: -1;
		result = cache.isTextInText[needle + haystack];
	}
	return 0 < result;
};
