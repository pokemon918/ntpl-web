import dateFns from 'date-fns';
import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {winesConstants, appConstants, multiStepFormConstants} from 'const';

const defaultData = {
	data: null,
	error: null,
	loading: false,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case winesConstants.FETCH_SELECTED_WINE_PENDING:
		case multiStepFormConstants.SUBMIT_START: {
			return {...state, data: null, loading: true};
		}

		case winesConstants.FETCH_SELECTED_WINE: {
			let selectedWine = Object.assign({}, state, {
				data: {updatedRef: true, ...action.payload},
				error: null,
				loading: false,
			});
			return selectedWine;
		}
		case winesConstants.FETCH_SELECTED_WINE_FULFILLED: {
			let selectedWine = Object.assign({}, state, {data: action.payload.data, loading: false});
			return selectedWine;
		}

		case appConstants.SERVER_ERROR: {
			return {...state, loading: false};
		}

		case multiStepFormConstants.SUBMIT_FULFILLED: {
			const payload = Object.assign({}, action.payload, {
				ref: action.payload.name,
				id: action.payload.name,
				created_at: dateFns.format(new Date()),
			});

			return {
				...state,
				loading: action.payload.isOnline ? true : false,
				data: payload,
			};
		}

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`:
			return {
				...state,
				loading: false,
				data: {updatedRef: true, ...action.payload.data},
			};

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_ROLLBACK`:
			return {
				...state,
				loading: false,
				data: action.payload.data,
			};

		case winesConstants.FETCH_SELECTED_WINE_REJECTED: {
			bugsnagClient.notify(new Error('Failed to fetch selected wine.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let date = Object.assign({}, state, {error: action.payload.error, isLoading: false});
			return date;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}
		default:
			return state;
	}
}
