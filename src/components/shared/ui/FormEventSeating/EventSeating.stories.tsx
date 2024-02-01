import React from 'react';
import {action} from '@storybook/addon-actions';

import EventSeating from './EventSeating';

export default {
	title: 'UI Kit / Inputs / Event Seating',
	component: EventSeating,
};

export const normal = () => <EventSeating name="seats" onChange={action('Changed')} />;
