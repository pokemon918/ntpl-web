import React from 'react';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';
import {cleanup, render, fireEvent} from '@testing-library/react';

import SiteHeader from './index';

describe('SiteHeader', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(
			<IntlProvider locale="en">
				<MemoryRouter>
					<SiteHeader onMenuClick={() => null} />
				</MemoryRouter>
			</IntlProvider>
		);
		expect(container.firstChild).toBeTruthy();
	});

	/*it('Should call callback function on click hamburger menu', () => {
		const onMenuClick = jest.fn();

		const {getByTestId} = render(
			<IntlProvider locale="en">
				<MemoryRouter>
					<SiteHeader onMenuClick={onMenuClick} />
				</MemoryRouter>
			</IntlProvider>
		);

		expect(onMenuClick).not.toHaveBeenCalled();

		const hamburgerMenu = getByTestId('hamburger-menu');
		fireEvent.click(hamburgerMenu);
		expect(onMenuClick).toHaveBeenCalledTimes(1);
	});*/
});
