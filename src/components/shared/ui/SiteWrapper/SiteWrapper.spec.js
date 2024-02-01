import React from 'react';
import {Provider} from 'react-redux';
import {cleanup, render} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import {MemoryRouter} from 'react-router-dom';

import SiteWrapper from './index';

const mockStore = configureMockStore();
const store = mockStore({
	app: {},
	user: {},
});

describe('SiteWrapper', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(
			<Provider store={store}>
				<MemoryRouter>
					<SiteWrapper />
				</MemoryRouter>
			</Provider>
		);
		expect(container.firstChild).toBeTruthy();
	});
});
