import React from 'react';
import {cleanup, fireEvent, prettyDOM} from '@testing-library/react';

import {renderWithIntl} from 'commons/testing';
import AutoSuggestInput from './index';
import {Autosuggest} from 'commons/autosuggest';

let selectedItem = null;

const props = {
	label: 'Search colours',
	items: [
		{hex: '#ff0000', description: 'Color Red'},
		{hex: '#00ff00', description: 'Color Green'},
		{hex: '#0000ff', description: 'Color Blue'},
	],
	valueKey: 'hex',
	displayKey: 'description',
	onSelectItem: jest.fn().mockImplementation((newItem) => {
		selectedItem = newItem;
	}),
};

describe('AutoSuggestInput', () => {
	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
		selectedItem = null;
	});

	it('Should render self', () => {
		const {container} = renderWithIntl(<AutoSuggestInput />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render empty input by default', () => {
		const {getByPlaceholderText} = renderWithIntl(<AutoSuggestInput {...props} />);
		const input = getByPlaceholderText(props.label);
		expect(input.value).toBe('');
	});

	it('Should not render list by default', () => {
		const {queryByText} = renderWithIntl(<AutoSuggestInput {...props} />);
		expect(queryByText('Color Red')).toBeNull();
		expect(queryByText('Color Green')).toBeNull();
		expect(queryByText('Color Blue')).toBeNull();
	});

	it('Should not render list by focusing the input', () => {
		const {getByPlaceholderText, queryByText} = renderWithIntl(<AutoSuggestInput {...props} />);

		const input = getByPlaceholderText(props.label);
		fireEvent.focus(input);

		expect(queryByText('Color Red')).toBeNull();
		expect(queryByText('Color Green')).toBeNull();
		expect(queryByText('Color Blue')).toBeNull();
	});

	it('Should render list after typing in the input', () => {
		const {getByPlaceholderText, getByText, rerender} = renderWithIntl(
			<AutoSuggestInput {...props} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(getByText('Color Red')).toBeTruthy();
		expect(getByText('Color Green')).toBeTruthy();
		expect(getByText('Color Blue')).toBeTruthy();
	});

	it('Should fire callback function with the selected item', () => {
		const {getByPlaceholderText, getByText} = renderWithIntl(<AutoSuggestInput {...props} />);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(props.onSelectItem).not.toHaveBeenCalled();

		const blue = getByText('Color Blue');
		fireEvent.click(blue);

		expect(props.onSelectItem).toHaveBeenCalledTimes(1);
		expect(props.onSelectItem.mock.calls[0][0]).toEqual({
			hex: '#0000ff',
			description: 'Color Blue',
		});
	});

	it('Should render selected item in the input', () => {
		const {rerender, getByPlaceholderText, getByText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');

		const blue = getByText('Color Blue');
		fireEvent.click(blue);
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);

		expect(input.value).toBe('Color Blue');
	});

	it('Should filter list by typing in the input', () => {
		const {getByPlaceholderText, getByText, queryByText} = renderWithIntl(
			<AutoSuggestInput {...props} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(getByText('Color Red')).toBeTruthy();
		expect(getByText('Color Green')).toBeTruthy();
		expect(getByText('Color Blue')).toBeTruthy();

		fireEvent.change(input, {target: {value: 'color bl'}});

		expect(queryByText('Color Red')).toBeNull();
		expect(queryByText('Color Green')).toBeNull();
		expect(getByText('Color Blue')).toBeTruthy();
	});

	it('Should be able to navigate with arrow down key', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Green');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');
	});

	it('Should be able to navigate with arrow up key', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');

		fireEvent.keyDown(input, {key: 'ArrowUp'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');

		fireEvent.keyDown(input, {key: 'ArrowUp'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Green');

		fireEvent.keyDown(input, {key: 'ArrowUp'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		fireEvent.keyDown(input, {key: 'ArrowUp'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');
	});

	it('Should be able to go back and forth with arrow keys', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Green');

		fireEvent.keyDown(input, {key: 'ArrowUp'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Green');
	});

	it('Should navigate only on filtered items with arrow keys', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color bl'}});

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Blue');
	});

	it('Should select the first item of the list with enter key', () => {
		const {getByPlaceholderText} = renderWithIntl(<AutoSuggestInput {...props} />);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');
		expect(props.onSelectItem).not.toHaveBeenCalled();

		fireEvent.keyDown(input, {key: 'Enter'});

		expect(props.onSelectItem).toHaveBeenCalledTimes(1);
		expect(props.onSelectItem.mock.calls[0][0]).toEqual({
			hex: '#ff0000',
			description: 'Color Red',
		});
	});

	it('Should select a specific item with enter key', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');
		expect(props.onSelectItem).not.toHaveBeenCalled();

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Green');

		props.onSelectItem.mockClear();
		fireEvent.keyDown(input, {key: 'Enter'});

		expect(props.onSelectItem).toHaveBeenCalledTimes(1);
		expect(props.onSelectItem.mock.calls[0][0]).toEqual({
			hex: '#00ff00',
			description: 'Color Green',
		});
	});

	it('Should clear selected item with backspace key', () => {
		const {rerender, getByPlaceholderText} = renderWithIntl(
			<AutoSuggestInput {...props} value={selectedItem} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(input.value).toBe('color');

		fireEvent.keyDown(input, {key: 'ArrowDown'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('Color Red');

		props.onSelectItem.mockClear();
		expect(props.onSelectItem).not.toHaveBeenCalled();

		fireEvent.keyDown(input, {key: 'Backspace'});
		rerender(<AutoSuggestInput {...props} value={selectedItem} />);
		expect(input.value).toBe('');
	});

	it('Should close the list with escape key', () => {
		const {getByPlaceholderText, getByText, queryByText} = renderWithIntl(
			<AutoSuggestInput {...props} />
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(getByText('Color Red')).toBeTruthy();
		expect(getByText('Color Green')).toBeTruthy();
		expect(getByText('Color Blue')).toBeTruthy();

		fireEvent.keyDown(input, {key: 'Escape'});

		expect(queryByText('Color Red')).toBeNull();
		expect(queryByText('Color Green')).toBeNull();
		expect(queryByText('Color Blue')).toBeNull();
	});

	it('Should close the list when clicked outside', () => {
		const {getByPlaceholderText, getByText, queryByText} = renderWithIntl(
			<div>
				<span>Outside text</span>
				<AutoSuggestInput {...props} />
			</div>
		);

		const input = getByPlaceholderText(props.label);
		fireEvent.change(input, {target: {value: 'color'}});

		expect(getByText('Color Red')).toBeTruthy();
		expect(getByText('Color Green')).toBeTruthy();
		expect(getByText('Color Blue')).toBeTruthy();

		const outside = getByText('Outside text');
		fireEvent.mouseDown(outside);

		expect(queryByText('Color Red')).toBeNull();
		expect(queryByText('Color Green')).toBeNull();
		expect(queryByText('Color Blue')).toBeNull();
	});
});
