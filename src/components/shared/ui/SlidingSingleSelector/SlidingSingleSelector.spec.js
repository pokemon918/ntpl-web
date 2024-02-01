import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';

import SlidingSingleSelector from './index';

const createProps = ({options, onChange, selectedOption} = {}) => ({
	options,
	onChange,
	selectedOption,
});

const options = [
	{id: 'sl', description: 'Super Light'},
	{id: 'l', description: 'Light'},
	{id: 'm', description: 'Medium'},
	{id: 'p', description: 'Pronounced'},
	{id: 'sp', description: 'Super Cool'},
	{id: 'c', description: 'Coolest'},
];

describe('Sliding Single Selector', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<SlidingSingleSelector />);
		expect(container).toBeTruthy();
	});

	it('Should render sample info', () => {
		const onChange = jest.fn();
		const selectedOption = {id: 'Light', description: 'Some text'};
		const props = createProps({
			options,
			onChange,
			selectedOption,
		});
		const {container} = render(<SlidingSingleSelector {...props} />);
		expect(container).toBeTruthy();
	});

	it('Should fire change callback when clicking another option', () => {
		const onChange = jest.fn();
		const selectedOption = {id: 'Light', description: 'Some text'};
		const props = createProps({
			options,
			onChange,
			selectedOption,
		});
		const {getByText} = render(<SlidingSingleSelector {...props} />);
		expect(onChange).not.toHaveBeenCalled();

		const superCool = getByText('Super Cool');
		fireEvent.mouseDown(superCool);
		fireEvent.mouseUp(superCool);
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});
