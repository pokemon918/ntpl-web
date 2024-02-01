import React from 'react';
import {action} from '@storybook/addon-actions';

import TextInput from './index';

export default {
	title: 'UI Kit / Inputs / Text Input',
	component: TextInput,
};

export const text = () => <TextInput label="Name" type="text" onChange={action('onChange')} />;

export const password = () => (
	<TextInput label="Password" type="password" onChange={action('onChange')} />
);

export const placeholder = () => (
	<TextInput placeholder="Name" type="text" onChange={action('onChange')} />
);
