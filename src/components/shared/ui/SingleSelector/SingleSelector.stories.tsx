import React from 'react';
import {action} from '@storybook/addon-actions';

import SingleSelector from './index';

export default {
	title: 'UI Kit / General / Single Selector',
	component: SingleSelector,
};

const colorSelectionListItems = [
	{
		id: 'nuance_white',
		name: 'White',
	},
	{
		id: 'nuance_red',
		name: 'Red',
	},
	{
		id: 'nuance_orange',
		name: 'Orange',
	},
	{
		id: 'type_rose',
		name: 'Rose',
	},
	{
		id: 'type_white',
		name: 'White',
	},
];

const tastingSelectionListItems = [
	{
		id: 'profound_',
		name: 'Profound',
		description: 'For the tasting that donec it elit non mi porta gravida at eget metus.',
	},
	{
		id: 'quick_',
		name: 'Quick',
		description: 'When you want to estibulum id ligula porta felis euismod semper.',
	},
];

const selectionListItems = [
	{
		id: 'notes_fruit_red_',
		name: 'Red Fruit',
	},
	{
		id: 'notes_fruit_black_',
		name: 'Black Fruit',
	},
	{
		id: 'notes_fruit_dried_',
		name: 'Dried Fruit',
	},
	{
		id: 'notes_fruit_cooked_',
		name: 'Cooked Fruit',
	},
];

const events = [
	{
		name: 'SWA Event',
		description: 'For the tasting that donec it elit non mi porta gravida at eget metus.',
		subheader: 'Important Sub Header',
	},
];

const wineTypeSelectionListItems = [
	{
		id: 'category_still',
		name: 'Still',
	},
	{
		id: 'category_sparkling',
		name: 'Sparkling',
	},
	{
		id: 'type_sherry_',
		name: 'Fortified',
	},
];

export const tasting = () => (
	<SingleSelector type="default" items={tastingSelectionListItems} onSelect={action('Selected')} />
);

export const notesList = () => (
	<SingleSelector items={selectionListItems} onSelect={action('Selected')} type="default" />
);

export const notesListSelected = () => (
	<SingleSelector
		type="default"
		items={selectionListItems}
		onSelect={action('Selected')}
		selected={{id: 'notes_fruit_red_', name: 'Red Fruit'}}
	/>
);

export const coloursList = () => (
	<SingleSelector items={colorSelectionListItems} onSelect={action('Selected')} type="color" />
);

export const coloursListSelected = () => (
	<SingleSelector
		type="color"
		items={colorSelectionListItems}
		onSelect={action('Selected')}
		selected={{id: 'nuance_rose', name: 'Rose'}}
	/>
);

export const winesList = () => (
	<SingleSelector
		items={wineTypeSelectionListItems}
		onSelect={action('Selected')}
		type="winetype"
	/>
);

export const winesListSelected = () => (
	<SingleSelector
		type="winetype"
		items={wineTypeSelectionListItems}
		onSelect={action('Selected')}
		selected={{id: 'category_still', name: 'Rose'}}
	/>
);

export const eventList = () => (
	<SingleSelector type="event" items={events} hideArrow={true} onSelect={action('Selected')} />
);

export const eventListWithSubheader = () => (
	<SingleSelector
		renderSubHeader={(event: {subheader: string}) => event.subheader}
		type="event"
		items={events}
		hideArrow={true}
		onSelect={action('Selected')}
	/>
);

export const listWithNoArrows = () => (
	<SingleSelector
		type="default"
		items={selectionListItems}
		onSelect={action('Selected')}
		hideArrow={true}
	/>
);
