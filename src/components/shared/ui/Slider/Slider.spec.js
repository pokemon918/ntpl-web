import React from 'react';
import {IntlProvider} from 'react-intl';
import {cleanup, fireEvent, render} from '@testing-library/react';

import Slider from './index';

const createProps = ({title, minimum, maximum, current, onChange} = {}) => ({
	title,
	minimum,
	maximum,
	current,
	onChange,
});

describe('Slider componenet', () => {
	afterEach(cleanup);

	it('Slider should render wihtout crashing', () => {
		const title = 'Sweetness';
		const minimum = 1;
		const maximum = 15;
		const current = 10;
		const onChange = jest.fn();
		const props = createProps({title, minimum, maximum, current, onChange});

		const {container} = render(
			<IntlProvider locale="en">
				<Slider {...props} />
			</IntlProvider>
		);

		expect(container.firstChild).toBeTruthy();
	});
});
