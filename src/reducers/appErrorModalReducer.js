import {appConstants} from 'const';
import bugsnagClient from 'config/bugsnag';
import get from 'lodash/get';

import {getErrorTitle, getErrorMessage, getErrorData} from './functions/normalizeError';

let defaultData = {
	isOpen: false,
	title: '',
	message: '',
	error: '',
	serverErrorCount: 0,
	mustLoginAgain: false,
	additionalData: '',
	serverError: false,
};

let errorCount = 0;

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.OPEN_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {
				isOpen: true,
				title: getErrorTitle(action) || 'app_oops',
				message: getErrorMessage(action) || 'shared_error_cannot_complete_action_',
				additionalData: getErrorData(action) || '',
				mustLoginAgain:
					(action.payload && action.payload.status === 401) ||
					(action.payload.error && action.payload.error.message === 'error_invalid_credentials'),
			});
			return data;
		}

		case appConstants.SERVER_ERROR:
			bugsnagClient.notify(new Error('Could not reach the server. Are you online?'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.error, 'request.path'),
				},
			});
			return {
				...state,
				isOpen: true,
				serverError: true,
				serverErrorCount: errorCount++,
				title: 'app_server_error',
				message: 'app_server_error_description',
			};

		case appConstants.CLEAR_SERVER_ERROR:
			return {...state, serverError: false, error: ''};

		case appConstants.TOGGLE_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {isOpen: action.payload});
			return data;
		}
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {isOpen: false});
			return data;
		}

		default:
			return state;
	}
}
