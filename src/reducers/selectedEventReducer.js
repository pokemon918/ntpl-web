import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {eventsConstants, appConstants} from 'const';
import {jsonFromApi} from 'commons/commons';

const defaultData = {
	data: null,
	loading: false,
	error: null,
	isSaving: false,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			return {...state, loading: false, isSaving: false, error: null};
		}

		case eventsConstants.FETCH_SELECTED_EVENT: {
			let data = Object.assign({}, state, {
				data: action.payload.data,
				loading: true,
				error: null,
			});
			return data;
		}

		case eventsConstants.FETCH_SELECTED_EVENT_PENDING: {
			return {
				...state,
				loading: true,
			};
		}

		case eventsConstants.FETCH_SELECTED_EVENT_FULFILLED: {
			let data = Object.assign({}, state, {
				data: action.payload.data,
				loading: false,
				error: null,
			});
			return data;
		}
		case eventsConstants.FETCH_SELECTED_EVENT_REJECTED: {
			if (
				action.error &&
				action.error.response &&
				action.error.response.status &&
				action.error.response.status === 500
			) {
				bugsnagClient.notify(new Error('Failed to fetch selected event.'), {
					metadata: {
						frontendUrl: window.location.href,
						requestUrl: get(action.payload, 'request.path'),
					},
				});
			}

			let data = Object.assign({}, state, {
				error: action.payload.error,
				data: null,
				loading: false,
			});
			return data;
		}
		case eventsConstants.UPDATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}
		case eventsConstants.UPDATE_SUCCESS: {
			let data = Object.assign({}, state, {
				data: action.payload,
				isSaving: false,
				status: 'success',
			});
			return data;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}
		default:
			return state;
	}
}

export function getSelectedEventMetadata(state) {
	try {
		return jsonFromApi(state.selectedEvent.data.metadata);
	} catch (err) {}
	return null;
}

export function getSelectedEventTastingByRef(selectedEvent, tastingRef) {
	return selectedEvent?.tastings?.find((tasting) => tasting.ref === tastingRef);
}
