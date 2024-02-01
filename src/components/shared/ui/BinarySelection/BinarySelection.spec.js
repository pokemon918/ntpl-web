import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import BinarySelection from './index';

const createProps = ({selected, onSelect} = {}) => ({
	selected,
	onSelect,
});

describe('BinarySelection componenet', () => {
	afterEach(cleanup);

	it('BinarySelection should render without crashing', () => {
		const selected = false;
		const onSelect = jest.fn();

		const props = createProps({selected, onSelect});

		const {container} = render(<BinarySelection {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render with default Yes', () => {
		const selected = true;
		const onSelect = jest.fn();
		const props = createProps({selected, onSelect});

		const {getByText} = render(<BinarySelection {...props} />);
		const selectedClassname = getByText('Yes').className;

		expect(selectedClassname).toBe('BinarySelection_Item active');
	});

	it('Should render with default No', () => {
		const selected = false;
		const onSelect = jest.fn();
		const props = createProps({selected, onSelect});

		const {getByText} = render(<BinarySelection {...props} />);
		const selectedClassname = getByText('No').className;

		expect(selectedClassname).toBe('BinarySelection_Item active');
	});
});
