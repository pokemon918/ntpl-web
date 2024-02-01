import React from 'react';

import {action} from '@storybook/addon-actions';
import SubSection from './index';

export default {
	title: 'UI Kit / General / Sub Section',
	component: SubSection,
};

const subSectionItem = [
	{
		isActive: true,
		key: 'noseintensity__',
		activeOption: 'condition_clean',
		options: ['condition_clean', 'condition_unclean'],
	},
	{
		key: 'development__',
		options: ['condition_clean', 'condition_unclean'],
	},
];

export const normal = () => (
	<SubSection items={subSectionItem} handleOptionSelect={action('Clicked')} />
);
