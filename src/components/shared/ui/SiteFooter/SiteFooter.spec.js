import React from 'react';
import {cleanup, render} from '@testing-library/react';

import SiteFooter from './index';

describe('SiteFooter componenet', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<SiteFooter />);

		expect(container.firstChild).toBeTruthy();
	});
});
