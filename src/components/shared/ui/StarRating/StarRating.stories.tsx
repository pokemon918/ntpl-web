import React from 'react';
import {action} from '@storybook/addon-actions';

import StarRating from './index';

export default {
	title: 'UI Kit / Inputs / Star Rating',
	component: StarRating,
};

export const normal = () => <StarRating onHandleClick={action('Rating selected')} />;

export const initialValue = () => (
	<StarRating rating={3} onHandleClick={action('Rating selected')} />
);

export const readOnly = () => (
	<StarRating onHandleClick={action('Rating selected')} readOnly={true} rating={4} />
);
