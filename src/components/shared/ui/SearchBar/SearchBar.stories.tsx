import React from 'react';

import SearchBar from './SearchBar';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / Inputs / Search Bar',
	component: SearchBar,
};

export const normal = () => <SearchBar onHandleChange={action('changed')} />;
