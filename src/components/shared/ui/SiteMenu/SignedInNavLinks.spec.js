import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import SignedInNavLinks from './SignedInNavLinks';

const createProps = ({closeSideNav}) => ({
	closeSideNav,
});

describe('SignedInNavLinks', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const closeSideNav = jest.fn();
		const props = createProps({
			closeSideNav,
		});
		const {container} = render(
			<MemoryRouter>
				<SignedInNavLinks {...props} />
			</MemoryRouter>
		);
		expect(container.firstChild).toBeTruthy();
	});
});
