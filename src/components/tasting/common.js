import {tastingsConstants} from 'const';

export const isScholarView = (tastingType = '') => {
	return (
		tastingType.includes('scholar2') ||
		tastingType.includes('scholar2m') ||
		tastingType.includes('scholar3') ||
		tastingType.includes('scholar3m') ||
		tastingType.includes('scholar4') ||
		tastingType.includes('scholar4m')
	);
};

export const isSwa20 = (tastingType = '') => {
	return tastingType.includes(tastingsConstants.SWA20);
};

export const getTastingType = (typeName) => {
	switch (typeName) {
		case 'scholar2m':
			return 'scholar2';
		case 'scholar3m':
			return 'scholar3';
		case 'scholar4m':
			return 'scholar4';
		default:
			return typeName;
	}
};
