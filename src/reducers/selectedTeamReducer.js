import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {teamsConstants, appConstants} from 'const';

const defaultData = {
	data: null,
	error: null,
	isSaving: false,
	status: null,
	listRequestsJoin: [],
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			return {...state, isSaving: false, error: null};
		}

		case appConstants.OPEN_APP_ERROR_MODAL: {
			return {...state, isSaving: false, error: null};
		}

		case teamsConstants.FETCH_SELECTED_TEAM: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case teamsConstants.FETCH_SELECTED_TEAM_FULFILLED: {
			let data = Object.assign({}, state, {data: action.payload.data});
			return data;
		}
		case teamsConstants.FETCH_SELECTED_TEAM_REJECTED: {
			bugsnagClient.notify(new Error('Failed to fetch selected team.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload.error});
			return data;
		}
		case teamsConstants.UPDATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}
		case teamsConstants.UPDATE_SUCCESS: {
			let data = Object.assign({}, state, {
				data: action.payload,
				isSaving: false,
				status: 'success',
			});
			return data;
		}

		case teamsConstants.GET_LIST_REQUESTS_JOINING_FULFILLED: {
			const listRequestsJoin = action.payload.data;
			let data = Object.assign({}, state, {
				listRequestsJoin: listRequestsJoin,
				status: null,
				error: null,
			});
			return data;
		}

		case teamsConstants.GET_LIST_REQUESTS_JOINING_REJECTED: {
			bugsnagClient.notify(new Error('Failed to get list of requests joining.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload});
			return data;
		}

		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}

		case teamsConstants.CLEAR_SELECTED_TEAM: {
			return defaultData;
		}

		default:
			return state;
	}
}

export const selectedTeamNameSelector = (state) => state.selectedTeam.data?.name;
