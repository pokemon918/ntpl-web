import React from 'react';
import {cleanup, fireEvent} from '@testing-library/react';

import {renderWithIntl} from 'commons/testing';
import TextInput from './index';

const createProps = ({onChange, label, type} = {}) => ({
	onChange,
	label,
	type,
});

describe('TextInput componenet', () => {
	afterEach(cleanup);

	it('TextInput should render without crashing', () => {
		const label = 'Name';
		const type = 'text';
		const onChange = jest.fn();

		const props = createProps({label, type, onChange});

		const {container} = renderWithIntl(<TextInput {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('TextInput should render password field', () => {
		const label = 'Password';
		const type = 'password';
		const onChange = jest.fn();

		const props = createProps({label, type, onChange});

		const {container} = renderWithIntl(<TextInput {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire a callback function with the updated text', () => {
		const label = 'Name';
		const type = 'text';
		const onChange = jest.fn();

		const props = createProps({label, onChange});

		const {getByPlaceholderText} = renderWithIntl(<TextInput {...props} />);

		const input = getByPlaceholderText('Name');

		expect(onChange).not.toHaveBeenCalled();

		fireEvent.change(input, {target: {value: 'Test Name'}});
		expect(input.value).toBe('Test Name');

		expect(onChange).toHaveBeenCalledTimes(1);
	});
});
