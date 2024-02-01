import React from 'react';
import {action} from '@storybook/addon-actions';

import BinarySelection from '../BinarySelection';

export default {
	title: 'UI Kit / General / Binary Selection',
	component: BinarySelection,
};

export const selectedYes = () => <BinarySelection selected={true} onSelect={action('Selected')} />;

export const selectedNo = () => <BinarySelection selected={false} onSelect={action('Selected')} />;
