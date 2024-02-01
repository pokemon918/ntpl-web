import React from 'react';
import {action} from '@storybook/addon-actions';

import MultiSelector from './index';

export default {
	title: 'UI Kit / General / Multi Selector',
	component: MultiSelector,
};

const notesSelectionListItems = [
	{id: 1, name: 'Vanilla'},
	{id: 2, name: 'Cloves'},
	{id: 3, name: 'Nutmeg'},
	{id: 4, name: 'Coconut'},
	{id: 5, name: 'Butterscotch'},
	{id: 6, name: 'Toast'},
	{id: 7, name: 'Cedar'},
	{id: 8, name: 'Charred Wood'},
	{id: 9, name: 'Smoke'},
	{id: 10, name: 'Chocolate'},
	{id: 11, name: 'Coffee'},
	{id: 12, name: 'Resinous'},
];

export const normal = () => (
	<MultiSelector
		notes={notesSelectionListItems}
		onHandleSelect={action('Clicked')}
		customClass={'NotesSelection__List__Item'}
	/>
);
