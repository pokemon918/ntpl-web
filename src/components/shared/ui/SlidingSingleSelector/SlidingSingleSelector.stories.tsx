import React from 'react';

import {action} from '@storybook/addon-actions';
import SlidingSingleSelector from './index';

export default {
	title: 'UI Kit / General / Sliding Single Selector',
	component: SlidingSingleSelector,
};

export const normal = () => (
	<SlidingSingleSelector
		options={[
			{id: 'sl', description: 'Super Light'},
			{id: 'l', description: 'Light'},
			{id: 'm', description: 'Medium'},
			{id: 'p', description: 'Pronounced'},
			{id: 'sp', description: 'Super Cool'},
			{id: 'c', description: 'Coolest'},
		]}
		selectedOption={{id: 'm', description: 'Medium'}}
		onChange={action('onChange')}
	/>
);
