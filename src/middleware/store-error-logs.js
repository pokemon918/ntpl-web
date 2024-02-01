import shortid from 'shortid';

import {appConstants} from 'const';

const storeErrorLogs = (store) => (next) => (action) => {
	next(action);

	const {error, payload} = action;

	// only errors from api requests should be logged
	const errorStatus = error && error.status;
	const responseStatus = error && error.response && error.responseStatus;
	const reduxOfflineStatus = payload && payload.response && payload.response.statusCode;
	if (!error || (!errorStatus && !responseStatus && !reduxOfflineStatus)) {
		return;
	}

	const ref = shortid.generate();
	const time = new Date();
	const actionType = action.type;
	const referral = window.location.href;
	const request = error.request;
	const status = errorStatus || responseStatus || reduxOfflineStatus;
	store.dispatch({
		type: appConstants.STORE_ERROR_LOG,
		payload: {...payload, ref, time, actionType, referral, request, status},
	});
};

export default storeErrorLogs;
