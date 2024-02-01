import React from 'react';
import {cleanup, fireEvent, render, wait} from '@testing-library/react';

import Checkbox from './index';

const createProps = ({value, label, onChange} = {}) => ({
	value,
	label,
	onChange,
});

describe('Checkbox component', () => {
	afterEach(cleanup);

	it('Checkbox should render without crashing', () => {
		const onChange = jest.fn();
		const label = 'I prefer to give my credit card details later.';

		const props = createProps({label, onChange});
		const {container} = render(<Checkbox {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render correct label', () => {
		const onChange = jest.fn();
		const label = 'I prefer to give my credit card details later.';

		const props = createProps({label, onChange});
		const {getByText} = render(<Checkbox {...props} />);

		expect(getByText(label)).toBeTruthy();
	});

	it('Should render checkbox with checked value', () => {
		const value = true;
		const onChange = jest.fn();
		const label = 'I prefer to give my credit card details later.';

		const props = createProps({value, label, onChange});

		const {getByTestId} = render(<Checkbox {...props} />);
		expect(getByTestId('checkbox-input').className).toBe('Checkbox__Context active');
	});

	it('Should call callback function on click', () => {
		const value = true;
		const onChange = jest.fn();
		const label = 'I prefer to give my credit card details later.';

		const props = createProps({value, label, onChange});

		expect(onChange).not.toBeCalled();
		const {getByTestId} = render(<Checkbox {...props} />);

		fireEvent.click(getByTestId('checkbox-input'));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(false);
	});
});
