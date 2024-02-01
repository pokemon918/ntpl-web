import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import YearPicker from './index';

const createProps = ({onSelect} = {}) => ({
	onSelect,
});

describe('YearPicker componenet', () => {
	afterEach(cleanup);

	it('YearPicker should render without crashing', () => {
		const {container} = render(<YearPicker />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire a callback function with the selected year', () => {
		const onSelect = jest.fn();

		const props = createProps({onSelect});

		const {getByText} = render(<YearPicker {...props} />);

		expect(onSelect).not.toHaveBeenCalled();

		const currentYear = getByText('2019');
		fireEvent.click(currentYear);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith({undefined: 2019});
	});
});
