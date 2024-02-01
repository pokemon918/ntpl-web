import React from 'react';
import {action} from '@storybook/addon-actions';

import RadioDropdown from './index';

export default {
	title: 'UI Kit / Inputs / Radio Dropdown',
	component: RadioDropdown,
};

export const normal = () => () => (
	<RadioDropdown
		items={[
			{id: 'date', label: 'Most recent'},
			{id: 'name', label: 'Wine name: A-Z'},
			{id: 'price_low', label: 'Price: Low to high'},
			{id: 'price_high', label: 'Price: High to low'},
			{id: 'rating_low', label: 'Rating: Low to high'},
			{id: 'rating_high', label: 'Rating: High to low'},
		]}
		onChange={action('changed')}
	/>
);
