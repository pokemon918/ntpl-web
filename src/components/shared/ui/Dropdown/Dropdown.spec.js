import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';

import Dropdown from './index';

const props = {
	label: 'EUR',
	items: [
		{id: '1', key: 'EUR'},
		{id: '2', key: 'USD'},
		{id: '3', key: 'DRR'},
	],
	valueKey: 'id',
	displayKey: 'key',
	onSelectItem: jest.fn(),
};

describe('Dropdown', () => {
	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	it('Should render self', () => {
		const {container} = render(<Dropdown />);
		expect(container.firstChild).toBeTruthy();
	});

	/*	it('Should render default input by default', () => {
		const {getByText} = render(<Dropdown {...props} />);
		const input = getByText('EUR');
		expect(input).toBeTruthy();
	});

	it('Should render list after focusing the input', () => {
		const {getByText, getAllByText} = render(<Dropdown {...props} />);

		const input = getByText('EUR');

		fireEvent.click(input);

		expect(getByText('USD')).toBeTruthy();
		expect(getAllByText('EUR')).toBeTruthy();
		expect(getByText('DRR')).toBeTruthy();
	});

	it('Should fire callback function with the selected item', () => {
		const {getByPlaceholderText, getByText} = render(<Dropdown {...props} />);
		const input = getByText('EUR');

		fireEvent.click(input);

		expect(props.onSelectItem).not.toHaveBeenCalled();

		const blue = getByText('USD');
		fireEvent.click(blue);

		expect(props.onSelectItem).toHaveBeenCalledTimes(1);
		expect(props.onSelectItem).toHaveBeenCalledWith({id: '2', key: 'USD'});
	});*/
});
