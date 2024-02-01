import React from 'react';
import {action} from '@storybook/addon-actions';

import LocationInput from './index';

export default {
	title: 'UI Kit / Inputs / Location Input',
	component: LocationInput,
};

export const normal = () => <LocationInput onChange={action('onChange')} />;
