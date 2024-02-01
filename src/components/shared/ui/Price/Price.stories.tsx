import React from 'react';

import Price from './index';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / Inputs / Price',
	component: Price,
};

const currencies = [
	{id: 1, description: 'European Dollar', key: 'EUR'},
	{id: 2, description: 'US Dollar', key: 'USD'},
	{id: 3, description: 'GBP', key: 'GBP'},
	{id: 4, description: 'Japan', key: 'YEN'},
	{id: 5, description: 'Danish', key: 'DKK'},
];

export const normal = () => <Price currencies={currencies} onHandleSelect={action('Changed')} />;

export const initialValue = () => (
	<Price
		currencies={currencies}
		onHandleSelect={action('Changed')}
		initialPrice={12}
		initialCurrency={'YEN'}
	/>
);
