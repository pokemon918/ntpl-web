import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import RatingTotal from './index';

const createProps = ({value} = {}) => ({
	value,
});

describe('RatingTotal componenet', () => {
	afterEach(cleanup);

	it('RatingTotal should render without crashing', () => {
		const value = 4;

		const props = createProps({value});

		const {container} = render(<RatingTotal {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render correct value', () => {
		const value = 100;
		const props = createProps({value});

		const {getByText} = render(<RatingTotal {...props} />);

		expect(getByText('100')).toBeTruthy();
	});
});
