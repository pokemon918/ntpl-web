import React from 'react';

import Radio from './index';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / Inputs / Radio',
	component: Radio,
};

export const normal = () => (
	<Radio
		id="default_radio"
		name="radio"
		label="I prefer to give my credit card details later."
		onChange={action('Changed')}
	/>
);

export const checked = () => (
	<Radio
		id="default_radio"
		name="radio"
		label="I prefer to give my credit card details later."
		onChange={action('Changed')}
		isChecked={true}
	/>
);

export const multiple = () => (
	<div>
		<Radio
			id="radio_1"
			name="radio"
			label="I prefer to give my credit card details later."
			onChange={action('Changed')}
			isChecked={true}
		/>
		<Radio
			id="radio_2"
			name="radio"
			label="I prefer to give my debit card details later."
			onChange={action('Changed')}
		/>
		<Radio
			id="radio_3"
			name="radio"
			label="I prefer to give my smart card details later."
			onChange={action('Changed')}
		/>
	</div>
);
