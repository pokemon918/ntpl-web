import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {cleanup, fireEvent} from '@testing-library/react';
import {MemoryRouter as Router} from 'react-router-dom';

import {renderWithIntl} from 'commons/testing';
import LocationInput from './index';

const createProps = ({onChange, onGeolocationClick}) => ({
	onChange,
	onGeolocationClick,
});

const mockStore = configureMockStore();
const store = mockStore({
	appErrorModal: {},
});

describe('Location Input', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = renderWithIntl(
			<Router>
				<Provider store={store}>
					<LocationInput />
				</Provider>
			</Router>
		);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should trigger callback for input change', () => {
		const onChange = jest.fn();
		const onGeolocationClick = jest.fn();
		const props = createProps({
			onChange,
			onGeolocationClick,
		});
		const {getByPlaceholderText} = renderWithIntl(
			<Router>
				<Provider store={store}>
					<LocationInput {...props} />
				</Provider>
			</Router>
		);
		expect(onChange).not.toHaveBeenCalled();

		const locationInput = getByPlaceholderText('Location');

		locationInput.value = 'Location 1';

		expect(locationInput.value).toBe('Location 1');
	});
});
