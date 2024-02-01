import React from 'react';
import {action} from '@storybook/addon-actions';

import TextArea from './TextArea';

export default {
	title: 'UI Kit / Inputs / Text Area',
	component: TextArea,
};

export const normal = () => (
	<TextArea placeholder="app_description" value="" infoKey="foo" onChange={action('Changed')} />
);
