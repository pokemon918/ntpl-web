import React from 'react';
import {cleanup, fireEvent} from '@testing-library/react';

import {renderWithIntl} from 'commons/testing';
import Select from './index';

const props = {
	items: [
		{phone: '1', name: 'US'},
		{phone: '2', name: 'CHINA'},
		{phone: '3', name: 'UK'},
	],
	valueKey: 'phone',
	displayKey: 'name',
	onSelectItem: jest.fn(),
};

describe('Select', () => {
	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	it('Should render self', () => {
		const {container} = renderWithIntl(<Select />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render list after focusing the input', () => {
		const {getByText, getAllByText, container} = renderWithIntl(<Select {...props} />);

		const input = container.querySelector('.Select__Field');

		fireEvent.click(input);

		expect(getByText('US 1')).toBeTruthy();
		expect(getAllByText('CHINA 2')).toBeTruthy();
		expect(getByText('UK 3')).toBeTruthy();
	});

	it('Should fire callback function with the selected item', () => {
		const {getByPlaceholderText, getByText, container} = renderWithIntl(<Select {...props} />);
		const input = container.querySelector('.Select__Field');

		fireEvent.click(input);

		expect(props.onSelectItem).not.toHaveBeenCalled();

		const blue = getByText('US 1');
		fireEvent.click(blue);

		expect(props.onSelectItem).toHaveBeenCalledTimes(1);
		expect(props.onSelectItem).toHaveBeenCalledWith({phone: '1', name: 'US'});
	});
});
