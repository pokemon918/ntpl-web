import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import SiteMenuOverlay from './SiteMenuOverlay';

const createProps = ({closeSideNav}) => ({
	closeSideNav,
});

describe('SiteMenuOverlay', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const closeSideNav = jest.fn();
		const props = createProps({
			closeSideNav,
		});
		const {container} = render(
			<MemoryRouter>
				<SiteMenuOverlay {...props} />
			</MemoryRouter>
		);
		expect(container.firstChild).toBeTruthy();
	});
});
