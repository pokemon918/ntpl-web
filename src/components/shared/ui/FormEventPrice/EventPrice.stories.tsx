import React from 'react';
import {action} from '@storybook/addon-actions';

import EventPrice from './EventPrice';

export default {
	title: 'UI Kit / Inputs / Event Price',
	component: EventPrice,
};

export const normal = () => <EventPrice name="price" onChange={action('Changed')} />;
