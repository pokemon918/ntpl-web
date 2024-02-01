import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {teamsConstants, appConstants} from 'const';

const defaultData = {
	data: [],
	error: null,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case teamsConstants.SEARCH_TEAMS: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case teamsConstants.SEARCH_TEAMS_FULFILLED: {
			let data = Object.assign({}, state, {data: action.payload, error: null});
			return data;
		}
		case teamsConstants.SEARCH_TEAMS_REJECTED: {
			bugsnagClient.notify(new Error('Failed to search teams.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload.error});
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
