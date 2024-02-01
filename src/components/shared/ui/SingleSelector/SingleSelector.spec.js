import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import SingleSelector from './index';

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

describe('SingleSelector componenet', () => {
	afterEach(cleanup);

	it('SingleSelector should render without crashing', () => {
		const onSelect = jest.fn();
		const selected = {id: 'notes_fruit_red_', name: 'Red Fruit'};
		const props = createProps({items, selected, onSelect});

		const {container} = render(<SingleSelector {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render with default selection on red fruits', () => {
		const onSelect = jest.fn();
		const selected = {id: 'notes_fruit_red_', name: 'Red Fruit'};

		const props = createProps({items, selected, onSelect});

		const {getByTestId} = render(<SingleSelector {...props} />);
		const selectedNode = getByTestId('selecting__notes_fruit_red_');
		expect(selectedNode.className.split(' ')).toContain('active');
	});

	it('Should fire onselect function on click', () => {
		const selected = {};
		const onSelect = jest.fn();
		const item = {id: 'notes_fruit_red_', name: 'Red Fruit'};
		const props = createProps({items, selected, onSelect});

		expect(onSelect).not.toBeCalled();

		const {getByText} = render(<SingleSelector {...props} />);
		const selectedElement = getByText('Red Fruit').parentElement;
		fireEvent.click(selectedElement);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(item);
	});

	it('Should add active class on click', () => {
		let selected = {};
		const onSelect = jest.fn((item) => (selected = item));
		const props = createProps({items, selected, onSelect});

		const {getByText, getByTestId, rerender} = render(<SingleSelector {...props} />);
		const selectedElement = getByText('Red Fruit').parentElement;
		fireEvent.click(selectedElement);
		expect(onSelect).toHaveBeenCalledWith({id: 'notes_fruit_red_', name: 'Red Fruit'});

		rerender(<SingleSelector {...props} selected={selected} />);
		const selectedNode = getByTestId('selecting__notes_fruit_red_');
		expect(selectedNode.className.split(' ')).toContain('active');
	});
});
