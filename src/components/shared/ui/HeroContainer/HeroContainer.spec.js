import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import HeroContainer from './index';

const createProps = ({handleMenuClick}) => ({
	handleMenuClick,
});

describe('HeroContainer', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<HeroContainer />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render sample text', () => {
		const {getByText} = render(<HeroContainer>Sample text in the hero container :D</HeroContainer>);
		expect(getByText('Sample text in the hero container :D')).toBeTruthy();
	});

	it('Should trigger callback for clicking the menu button', () => {
		const handleMenuClick = jest.fn();
		const props = createProps({
			handleMenuClick,
		});
		const {getByText} = render(<HeroContainer {...props} />);
		expect(handleMenuClick).not.toHaveBeenCalled();

		const menuButton = getByText('Menu');
		fireEvent.click(menuButton);

		expect(handleMenuClick).toHaveBeenCalledTimes(1);

		handleMenuClick.mockClear();
		fireEvent.click(menuButton);
		fireEvent.click(menuButton);
		expect(handleMenuClick).toHaveBeenCalledTimes(2);
	});
});
