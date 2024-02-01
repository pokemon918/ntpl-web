import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import SplashScreen from './index';

const createProps = ({text, onNavigation} = {}) => ({
	text,
	onNavigation,
});

describe('SplashScreen componenet', () => {
	afterEach(cleanup);

	it('SplashScreen should render without crashing', () => {
		const text = 'Enjoy a fast tasting';

		const props = createProps({text});

		const {container} = render(<SplashScreen {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render correct text', () => {
		const text = 'Enjoy a fast tasting';
		const props = createProps({text});

		const {getByText} = render(<SplashScreen {...props} />);

		expect(getByText(text)).toBeTruthy();
	});

	it('Should fire callback function when clicked', () => {
		const text = 'Enjoy a fast tasting';
		const onNavigation = jest.fn();
		const props = createProps({text, onNavigation});

		const {container} = render(<SplashScreen {...props} />);

		expect(onNavigation).not.toHaveBeenCalled();

		fireEvent.click(container.firstChild);

		expect(onNavigation).toHaveBeenCalledTimes(1);
	});
});
