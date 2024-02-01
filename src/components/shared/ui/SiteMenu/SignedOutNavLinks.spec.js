import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import SignedOutNavLinks from './SignedOutNavLinks';

const createProps = ({closeSideNav}) => ({
	closeSideNav,
});

describe('SignedOutNavLinks', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const closeSideNav = jest.fn();
		const props = createProps({
			closeSideNav,
		});
		const {container} = render(
			<MemoryRouter>
				<SignedOutNavLinks {...props} />
			</MemoryRouter>
		);
		expect(container.firstChild).toBeTruthy();
	});

	it.skip('Should trigger callback for clicking a link inside', () => {
		const closeSideNavCallback = jest.fn();

		const props = createProps({
			closeSideNav: closeSideNavCallback,
		});

		const {container} = render(
			<MemoryRouter>
				<SignedOutNavLinks {...props} />
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
