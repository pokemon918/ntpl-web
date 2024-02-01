import React from 'react';

import CharacteristicsSummary from './index';

export default {
	title: 'UI Kit / General / Characteristics Summary',
	component: CharacteristicsSummary,
};

export const normal = () => (
	<CharacteristicsSummary
		characteristics={[
			{name: 'sweetness__', steps: 6, value: 4},
			{name: 'acidity__', steps: 5, value: 2},
			{name: 'tannins__', steps: 6, value: 4},
			{name: 'alcohol__', steps: 3, value: 2},
			{name: 'body__', steps: 5, value: 2},
		]}
	/>
);
