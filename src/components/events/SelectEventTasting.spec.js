import React from 'react';
import {render, cleanup} from '@testing-library/react';
import SelectEventTasting from './SelectEventTasting';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

const store = mockStore({
	events: {
		tastingShowCaseData: {
			eventRef: 'yebnmpp',
			selectedTasting: {
				country: 'testCountry',
				created_at: '2019-07-09T08:55:19.000000Z',
				currency: 'EUR',
				location: 'testLocation',
				name: 'testName',
				price: 200,
				producer: 'testProducer',
				ref: 'zy5nl5c',
				region: 'testRegion',
				vintage: '2016',
			},
			type: 'quick',
		},
	},
	selectedEvent: {},
});

describe('SelectEventTasting', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(
			<Provider store={store}>
				<SelectEventTasting />
			</Provider>
		);
		expect(container.firstChild).toBeTruthy();
	});
});
