import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import SearchBar from './index';

const createProps = ({onHandleChange} = {}) => ({
	onHandleChange,
});

describe('SearchBar componenet', () => {
	afterEach(cleanup);

	it('Should render self', () => {
		const {container} = render(<SearchBar />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire change callback', () => {
		const onHandleChange = jest.fn();
		const props = createProps({onHandleChange});

		const {getByPlaceholderText} = render(<SearchBar {...props} />);
		expect(onHandleChange).not.toHaveBeenCalled();

		const searchElement = getByPlaceholderText('Search');
		fireEvent.change(searchElement, {target: {value: 'wine'}});

		expect(onHandleChange).toHaveBeenCalledTimes(1);
		expect(onHandleChange).toHaveBeenCalledWith('wine');

		expect(searchElement.value).toBe('wine');
	});
});
