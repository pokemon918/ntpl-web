import React from 'react';
import {action} from '@storybook/addon-actions';

import SearchResultsList from './index';

export default {
	title: 'UI Kit / General / Search Results List',
	component: SearchResultsList,
};

const searchResultsListItems = [
	{name: 'Palacio de Anglona Tempranillo'},
	{name: 'Palacio de Anglona Pinot Noir'},
	{name: 'Palacio de Anglona Merlot'},
	{name: 'Palacio de Anglona Syrah'},
];

const [firstItem] = searchResultsListItems;
const searchResultsListSelectedItem = {...firstItem};

export const normal = () => (
	<SearchResultsList items={searchResultsListItems} onSelect={action('onSelect')} />
);

export const selected = () => (
	<SearchResultsList
		items={searchResultsListItems}
		selectedItem={searchResultsListSelectedItem}
		onSelect={action('onSelect')}
	/>
);

export const highlightSearch = () => (
	<SearchResultsList
		items={searchResultsListItems}
		selectedItem={searchResultsListSelectedItem}
		highlightText="angl de pal"
		onSelect={action('onSelect')}
	/>
);
