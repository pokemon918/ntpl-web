import React from 'react';
import {action} from '@storybook/addon-actions';

import YearPicker from './index';

export default {
	title: 'UI Kit / Inputs / Year Picker',
	component: YearPicker,
};

export const normal = () => (
	<div>
		<YearPicker onSelect={action('onSelect')} />
	</div>
);

export const initialValue = () => (
	<div>
		<YearPicker selectedYear={2020} onSelect={action('onSelect')} />
	</div>
);
