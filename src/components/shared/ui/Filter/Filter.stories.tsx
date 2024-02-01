import React from 'react';
import {action} from '@storybook/addon-actions';

import Filter from './index';

export default {
	title: 'UI Kit / General / Filter',
	component: Filter,
};

const filterItems = [{description: 'Country'}, {description: 'City'}, {description: 'Tasting'}];

export const normal = () => () => <Filter items={filterItems} onSelect={action('selected')} />;
