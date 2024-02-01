import {_retryGet} from 'commons/commons';
import {appConstants} from 'const';
import {isLocalhost, handleError} from 'commons/commons';

export function saveComplete() {
	return (dispatch) => {
		dispatch({
			type: appConstants.SAVE_COMPLETE,
		});
	};
}

export function fetchNavbar() {
	//	return;
	return async (dispatch) => {
		dispatch({type: appConstants.FETCH_NAVBAR_PENDING});

		let err, response;
		const url = 'https://noteable.co/wp-json/wp-api-menus/v2/menus/10';

		try {
			[err, response] = await _retryGet(url);
		} catch (err) {
			if (isLocalhost()) {
				dispatch({
					type: appConstants.SERVER_ERROR,
					error: {request: {path: url, options: {method: 'GET'}}, status: 'Exception'},
				});
				throw err;
			}
		}

		if (err && isLocalhost()) {
			errorDispatch(dispatch, handleError(err, dispatch), appConstants.FETCH_NAVBAR_REJECTED, err);
			return;
		}

		let menuData = response.data;
		dispatch({type: appConstants.FETCH_NAVBAR_FULFILLED, payload: {data: menuData}});
	};
}

export function closeSideNav() {
	return (dispatch) => {
		dispatch({
			type: appConstants.CLOSE_SIDENAV,
		});
	};
}

export function setSubscriptionUrl(value) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_SUBSCRIPTION_URL,
			payload: value,
		});
	};
}

export function setSubscriptionType(type) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_SUBSCRIPTION_TYPE,
			payload: {
				type,
			},
		});
	};
}

export function setSkipSelectPlan(skipSelectPlan) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_SKIP_SELECT_PLAN,
			payload: {
				skipSelectPlan,
			},
		});
	};
}

export function setSubscriptionDuration(value) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_SUBSCRIPTION_DURATION,
			payload: value,
		});
	};
}

export function setPaymentMode(value) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_PAYMENT_MODE,
			payload: value,
		});
	};
}

export function setOffCanvas(isOffCanvas = false, offCanvasClass) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_NAV_OFFCANVAS,
			payload: {isOffCanvas, offCanvasClass},
		});
	};
}

export function setVoucher(value) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_VOUCHER,
			payload: value,
		});
	};
}

export function setCurrentState(value) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_CURRENT_STATE,
			payload: value,
		});
	};
}

export function saveAdvancedOptions(advancedOptions) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_ADVANCED_OPTIONS,
			payload: advancedOptions,
		});
	};
}

export function setServerError(path, method) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SERVER_ERROR,
			error: {request: {path, options: {method}}, status: 'Exception'},
		});
	};
}

export function clearServerError() {
	return (dispatch) => {
		dispatch({
			type: appConstants.CLEAR_SERVER_ERROR,
		});
	};
}

export function readErrorLog(ref) {
	return (dispatch) => {
		dispatch({
			type: appConstants.READ_ERROR_LOG,
			payload: {
				ref,
			},
		});
	};
}

export function setPreserveUrl(link) {
	return (dispatch) => {
		dispatch({
			type: appConstants.PRESERVE_URL,
			payload: link,
		});
	};
}

export function setSubscriptionWarning(state) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SHOW_SUBSCRIPTION_WARNING,
			payload: state,
		});
	};
}

export function displayErrorMessage(message) {
	return (dispatch) => {
		dispatch({
			type: appConstants.OPEN_APP_ERROR_MODAL,
			payload: {message},
		});
	};
}

export function errorDispatch(dispatch, payload, type = '', error) {
	dispatch({type: type, payload: {error: payload}, error});
	dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: {message: payload.message}});
}
