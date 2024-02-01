import React from 'react';

import BaseSummary from './index';

export default {
	title: 'UI Kit / General / Base Summary',
	component: BaseSummary,
};

export const fixedSteps = () => (
	<BaseSummary
		type="percent"
		items={[
			{name: 'rating_balance_', value: 45},
			{name: 'finish__', value: 72},
			{name: 'rating_intensity__', value: 35},
			{name: 'rating_complexity_', value: 68},
			{name: 'rating_terroir_', value: 53},
		]}
		rounded
	/>
);

export const variableSteps = () => (
	<BaseSummary
		type="percent"
		items={[
			{name: 'rating_balance_', steps: 2, value: 45},
			{name: 'finish__', steps: 3, value: 72},
			{name: 'rating_intensity__', steps: 4, value: 35},
			{name: 'rating_complexity_', steps: 5, value: 68},
			{name: 'rating_terroir_', steps: 6, value: 53},
		]}
		rounded
	/>
);

export const positionalValues = () => (
	<BaseSummary
		type="position"
		items={[
			{name: 'sweetness__', steps: 6, value: 4},
			{name: 'acidity__', steps: 5, value: 2},
			{name: 'tannins__', steps: 6, value: 4},
			{name: 'alcohol__', steps: 3, value: 2},
			{name: 'body__', steps: 5, value: 2},
		]}
	/>
);
