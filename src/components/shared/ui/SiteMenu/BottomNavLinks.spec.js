import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import BottomNavLinks from './BottomNavLinks';

const createProps = ({closeSideNav}) => ({
	closeSideNav,
});

describe('BottomNavLinks', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const closeSideNav = jest.fn();
		const props = createProps({
			closeSideNav,
		});
		const {container} = render(
			<MemoryRouter>
				<BottomNavLinks {...props} />
			</MemoryRouter>
		);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should trigger callback for clicking a link inside', () => {
		const closeSideNavCallback = jest.fn();

		const props = createProps({
			closeSideNav: closeSideNavCallback,
		});

		const {container} = render(
			<MemoryRouter>
				<BottomNavLinks {...props} />
			</MemoryRouter>
		);

		const link = container.querySelector('a');
		fireEvent.click(link);
		expect(closeSideNavCallback).toHaveBeenCalledTimes(1);

		closeSideNavCallback.mockClear();
		fireEvent.click(link);
		fireEvent.click(link);
		expect(closeSideNavCallback).toHaveBeenCalledTimes(2);
	});
});
