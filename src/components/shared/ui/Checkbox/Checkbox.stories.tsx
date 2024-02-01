import React from 'react';
import {action} from '@storybook/addon-actions';

import Checkbox from './index';

export default {
	title: 'UI Kit / Inputs / Checkbox',
	component: Checkbox,
};

export const normal = () => (
	<Checkbox label="I prefer to give my credit card details later." onChange={action('Changed')} />
);

export const checked = () => (
	<Checkbox
		label="I prefer to give my credit card details later."
		value={true}
		onChange={action('Changed')}
	/>
);
