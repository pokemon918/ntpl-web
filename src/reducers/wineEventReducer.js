import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {winesConstants, appConstants} from 'const';

const defaultData = {
	data: null,
	error: null,
	loading: false,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case winesConstants.CLEAR_WINE_EVENT: {
			return {...state, data: null, loading: false, error: null};
		}

		case winesConstants.FETCH_WINE_EVENT_PENDING: {
			return {...state, data: null, loading: true};
		}

		case winesConstants.FETCH_WINE_EVENT_FULFILLED: {
			let selectedWine = Object.assign({}, state, {
				data: action.payload.data,
				loading: false,
				error: null,
			});
			return selectedWine;
		}

		case appConstants.SERVER_ERROR: {
			return {...state, loading: false};
		}

		case winesConstants.FETCH_WINE_EVENT_REJECTED: {
			bugsnagClient.notify(new Error('Failed to fetch wine event.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let date = Object.assign({}, state, {error: action.payload.error, loading: false});
			return date;
		}

		default:
			return state;
	}
}
