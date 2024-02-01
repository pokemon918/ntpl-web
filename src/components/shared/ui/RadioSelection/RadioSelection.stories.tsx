import React from 'react';

import RadioSelection from './index';

export default {
	title: 'UI Kit / Inputs / Radio Selection',
	component: RadioSelection,
};

export const normal = () => (
	<RadioSelection
		items={[
			{
				id: 'item_1',
				label: 'Free Trial',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
			},
			{
				id: 'item_2',
				label: '12 months',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
			},
			{
				id: 'item_3',
				label: 'Coding',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ',
			},
		]}
		onChange={() => console.log('This is cool')}
		expandable
	/>
);
