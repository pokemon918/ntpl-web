import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import ListSelection from './index';

const createProps = ({items, selected, onSelect} = {}) => ({
	items,
	selected,
	onSelect,
});

const items = [
	{
		id: 'notes_fruit_red_',
		name: 'Red Fruit',
	},
	{
		id: 'notes_fruit_black_',
		name: 'Black Fruit',
	},
];

describe('ListSelection componenet', () => {
	afterEach(cleanup);

	it('ListSelection should render without crashing', () => {
		const onSelect = jest.fn();
		const selected = {id: 'notes_fruit_red_', name: 'Red Fruit'};
		const props = createProps({items, selected, onSelect});

		const {container} = render(<ListSelection {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render with default selection on red fruits', () => {
		const onSelect = jest.fn();
		const selected = {id: 'notes_fruit_red_', name: 'Red Fruit'};

		const props = createProps({items, selected, onSelect});

		const {getByText} = render(<ListSelection {...props} />);
		const selectedClassname = getByText('Red Fruit').parentElement.className;

		expect(selectedClassname).toBe('SelectionButton__Context active');
	});

	it('Should fire onselect function on click', () => {
		const selected = {};
		const onSelect = jest.fn();
		const item = {id: 'notes_fruit_red_', name: 'Red Fruit'};
		const props = createProps({items, selected, onSelect});

		expect(onSelect).not.toBeCalled();

		const {getByText} = render(<ListSelection {...props} />);
		const selectedElement = getByText('Red Fruit').parentElement;
		fireEvent.click(selectedElement);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(item);
	});

	it('Should add active class on click', () => {
		const selected = {};
		const onSelect = jest.fn();
		const props = createProps({items, selected, onSelect});

		const {getByText} = render(<ListSelection {...props} />);
		const selectedElement = getByText('Red Fruit').parentElement;
		fireEvent.click(selectedElement);

		const selectedClassname = getByText('Red Fruit').parentElement.className;

		expect(selectedClassname).toBe('SelectionButton__Context active');
	});
});
