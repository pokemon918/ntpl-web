import {basePath} from 'commons/shared';
import {
	signPath,
	clearCache,
	escapeHtml,
	trimValidUserName,
	isUserUnauthorized,
} from 'commons/commons';
import {initiateLogin, exportBackup, getAuthCreationPayload} from 'ntbl_client/ntbl_api';
import {userConstants, appConstants, routeConstants} from 'const';
import {_retryPost, _rePost, _reGet, _upload, _retryGet, handleError} from 'commons/commons';
import bugsnagClient from 'config/bugsnag';
import storage from 'redux-persist/lib/storage';

export function loginUser(email, rawPass, history) {
	clearCache();
	return async (dispatch) => {
		dispatch({type: userConstants.INITIATE_LOGIN});

		let err, specsResponse, userResponse;
		const path = '/user?email=' + encodeURIComponent(email);
		try {
			[err, specsResponse] = await _reGet(path, {retryMax: 0});
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: path},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			if (err.status !== 401) {
				err.customError = 'error_login';

				errorDispatch(
					dispatch,
					handleLoginError(err, dispatch, history),
					userConstants.LOGIN_FAILED,
					err
				);

				throw err;
			}
			throw err;
		}

		let specs = specsResponse.data;
		let userSpecs = {
			email: email,
			ref: specs.ref,
			salt: specs.salt,
			iterations: specs.iterations,
		};
		initiateLogin(rawPass, userSpecs.ref, userSpecs.salt, userSpecs.iterations);
		storage.setItem('mem', exportBackup());

		const userPath = '/user/' + userSpecs.ref;
		try {
			[err, userResponse] = await _reGet(userPath);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: userPath, options: {method: 'GET'}, url: '/sign-in'},
					status: 'Exception',
				},
			});

			throw err;
		}
		if (err) {
			err.customError = 'error_login';

			if (err.status !== 400) {
				errorDispatch(
					dispatch,
					handleLoginError(err, dispatch, history),
					userConstants.LOGIN_FAILED,
					err
				);
			}
			throw err;
		}

		const userData = Object.assign(userResponse.data, {email: email});
		if (userData.ref) {
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		} else {
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: null});
		}
	};
}

/*
Disabled loginUserByCache and checkForLoggedInUser as of 2018-12-20
export function loginUserByCache() {
	return (dispatch) => {
		dispatch({type: userConstants.INITIATE_LOGIN});
		if (userCacheExists()) {
			var userData = JSON.parse(localStorage.getItem('loggedinUser'));
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		} else {
			dispatch({type: userConstants.LOGIN_FAILED, payload: null});
		}
	};
}

export function checkForLoggedInUser(user, history, route = '/') {
	return (dispatch) => {
		dispatch({type: userConstants.CHECK_USER});
		if (!user.isLoggedIn && !userCacheExists()) {
			dispatch({type: userConstants.INITIATE_LOGOUT});
			window.location.href = route;
		}

		if (!user.isLoggedIn && userCacheExists()) {
			var userData = JSON.parse(localStorage.getItem('loggedinUser'));
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		}
	};
}
*/

export function logoutUser() {
	clearCache();
	localStorage.clear();

	return (dispatch) => {
		dispatch({
			type: userConstants.INITIATE_LOGOUT,
		});
	};
}

export function registerUser(rawPass, userInfo) {
	return async (dispatch) => {
		let err, response;
		let payload = getAuthCreationPayload(rawPass, userInfo);

		const path = basePath + '/user';
		const client_host = window.location.origin;
		dispatch({type: userConstants.CREATE_PENDING});

		try {
			[err, response] = await _retryPost(path, {
				...payload,
				name: trimValidUserName(payload.name),
				client_host,
			});
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'POST'}, url: '/sign-in', data: payload},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			if (err.status !== 401 && err.status !== 400) {
				err.customError = 'error_registration';
			}
			errorDispatch(dispatch, handleLoginError(err, dispatch), userConstants.CREATE_ERROR, err);

			throw err;
		}

		dispatch({type: userConstants.CREATE_SUCCESS, payload: response.data});
		return response.data;
	};
}

export function resetPassword(email) {
	return async (dispatch) => {
		let err, response;
		const path = basePath + '/user/access/reset';
		const client_host = window.location.origin;
		const data = {email, client_host};

		try {
			[err, response] = await _retryPost(path, data);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'POST'}, url: '/reset-password', data: data},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			throw err;
		}

		dispatch({type: userConstants.RESET_PASS_SUCCESS, payload: response.data});
	};
}

export function resetAccessWithToken(rawPass, token) {
	return async (dispatch) => {
		let err, response;
		let userData = getAuthCreationPayload(rawPass);
		const payload = {
			...userData,
			resetToken: token,
		};

		const path = basePath + '/user/access/reset';

		try {
			[err, response] = await _retryPost(path, payload);
		} catch (err) {
			err.customError = 'error_resetPassword';

			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'POST'}, url: '/reset', data: payload},
					status: 'Exception',
				},
			});

			throw err;
		}
		if (err) {
			throw err;
		}

		dispatch({type: userConstants.RESET_PASS_SUCCESS, payload: response.data});

		return response?.data?.data;
	};
}

export function changeLanguage(lang) {
	return async (dispatch) => {
		dispatch({type: userConstants.CHANGE_LANGUAGE, payload: lang});
	};
}

export function userPasswordChanged(payload) {
	return async (dispatch) => {
		dispatch({type: userConstants.USER_PASSWORD_CHANGED, payload: payload});
	};
}

export function clearData() {
	return async (dispatch) => {
		dispatch({type: userConstants.CLEAR_LOGIN_DATA});
	};
}

export function updateUserInfo(values) {
	return async (dispatch) => {
		let err, response;
		const path = '/user/profile';

		dispatch({type: userConstants.UPDATE_USER_INFO_PENDING});

		const payload = {};

		if (values.wine_knowledge) {
			payload.wine_knowledge = values.wine_knowledge;
		}

		if (values.name) {
			payload.name = trimValidUserName(values.name);
		}

		if (values.educations) {
			payload.educations = values.educations.map((i) => ({
				...i,
				school: escapeHtml(i.school),
				completed: i.status === 'graduated',
				year: i.status === 'graduated' ? i.year : undefined,
			}));
		}

		try {
			[err, response] = await _rePost(path, payload);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {
						path,
						options: {method: 'POST'},
						url: '/profile',
						data: payload,
					},
					status: 'Exception',
				},
			});
		}

		if (err) {
			err.customError = 'error_updateUser';
			errorDispatch(dispatch, handleError(err, dispatch), userConstants.UPDATE_USER_INFO_ERROR);

			throw err;
		}

		if (response) {
			dispatch({type: userConstants.UPDATE_USER_INFO_SUCCESS, payload: response.data});
		}
	};
}

export function addUserProfilePic(data) {
	return async (dispatch) => {
		let err, response;

		const signedPath = await signPath('/user/profile', 'POST');
		dispatch({type: userConstants.UPDATE_USER_INFO_PENDING});

		try {
			[err, response] = await _upload(signedPath, data);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: signedPath, options: {method: 'POST'}}, status: 'Exception'},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_updateUser';

			errorDispatch(dispatch, handleError(err, dispatch), userConstants.UPDATE_USER_INFO_ERROR);
			return;
		}
		dispatch({
			type: userConstants.UPDATE_USER_INFO_SUCCESS,
			payload: response.data,
		});
	};
}

export function changeUserPassword(email, password) {
	return async (dispatch) => {
		let err, response;
		// const path = basePath + '/user/access';
		const path = '/user/access';
		const pathUser = basePath + '/user?email=' + encodeURIComponent(email);

		let signedUserData = getAuthCreationPayload(password, {email});

		let newPayload = {
			hpass: signedUserData.hpass,
			iterations: signedUserData.iterations,
		};

		try {
			[err, response] = await _rePost(path, newPayload);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {
						path,
						path2: pathUser,
						options: {method: 'POST'},
						url: '/profile',
						data: {...newPayload, password: password, email: email},
						isChangePassword: true,
					},
					status: 'Exception',
				},
			});
		}

		if (err) {
			err.customError = 'error_changePassword';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.CHANGE_USER_PASSWORD_ERROR,
				err
			);
			return;
		}

		clearCache();

		let specsResponse;
		try {
			[, specsResponse] = await _retryGet(pathUser);
		} catch (ex) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: pathUser, options: {method: 'GET'}, url: '/profile'},
					status: 'Exception',
				},
			});

			throw ex;
		}

		let specs = specsResponse.data;
		let userSpecs = {
			email: email,
			ref: specs.ref,
			salt: specs.salt,
			iterations: specs.iterations,
		};
		initiateLogin(password, userSpecs.ref, userSpecs.salt, userSpecs.iterations);
		storage.setItem('mem', exportBackup());

		dispatch({type: userConstants.CHANGE_USER_PASSWORD_SUCCESS, payload: response.data});
	};
}

export function fetchUserInfo(history) {
	return async (dispatch) => {
		let err, response;

		dispatch({type: userConstants.FETCH_USER_PROFILE_PENDING});

		const path = '/user/profile';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}, url: '/profile'},
					status: 'Exception',
				},
			});
		}

		if (err) {
			err.customError = 'error_fetchProfile';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.FETCH_USER_PROFILE_ERROR,
				err
			);
		}

		if (response) {
			dispatch({type: userConstants.FETCH_USER_PROFILE_SUCCESS, payload: response.data});
		}
	};
}

export function getUserCounts() {
	return async (dispatch, getStore) => {
		let err, response;

		dispatch({type: userConstants.FETCH_USER_COUNTS_PENDING});

		const path = '/user/counts';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.FETCH_USER_COUNTS_ERROR,
				err
			);
			return routeConstants.HOME;
		}

		if (response) {
			const counts = response.data;
			dispatch({type: userConstants.FETCH_USER_COUNTS_SUCCESS, payload: counts});
			return counts;
		}

		return null;
	};
}

export function getActivePlan() {
	return async (dispatch) => {
		let err, response;
		dispatch({type: userConstants.GET_ACTIVE_PLAN_PENDING});

		const path = '/user/plan';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
			return err;
		}

		const hasNoSubscriptions =
			err &&
			err.status === 400 &&
			(err.message.includes('404 Not Found') || err.message.includes('no subscriptions'));

		const isNotAuthenticated = err && (err.status === 401 || err.message === 'error_unauthorized');

		if (hasNoSubscriptions || isNotAuthenticated) {
			err = null;
			response = [];
		}

		if (err) {
			err.customError = 'error_fetchActivePlan';
			bugsnagClient.notify(new Error('Unable to fetch user active plan!'), {
				metadata: {error: err},
			});
			errorDispatch(dispatch, handleError(err, dispatch), userConstants.GET_ACTIVE_PLAN_REJECTED);
			return null;
		}

		dispatch({type: userConstants.GET_ACTIVE_PLAN_FULFILLED, payload: response});

		if (response && response.data) {
			return response.data.active_plan;
		}

		return null;
	};
}

export function getSubscriptionPlans() {
	return async (dispatch) => {
		let err, response;
		dispatch({type: userConstants.GET_SUBSCRIPTION_PLAN_PENDING});

		const path = '/subscription/plans';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
			return;
		}

		if (err) {
			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.GET_SUBSCRIPTION_PLAN_REJECTED
			);
			return;
		}

		dispatch({type: userConstants.GET_SUBSCRIPTION_PLAN_FULFILLED, payload: response});
		return response.data;
	};
}

export function createSubscription(product_handle, chargify_token) {
	return async (dispatch) => {
		let err, response;
		dispatch({type: userConstants.CREATE_SUBSCRIPTION_PENDING});

		const path = '/subscription';
		try {
			[err, response] = await _rePost(path, {
				membership_plan: product_handle,
				chargify_token,
			});
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'POST'}}, status: 'Exception'},
			});
			return;
		}

		if (err) {
			err.customError = 'error_createSubscription';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.CREATE_SUBSCRIPTION_REJECTED
			);
			return;
		}

		dispatch({type: userConstants.CREATE_SUBSCRIPTION_FULFILLED, payload: response});
	};
}

export function refreshSubscription() {
	return async (dispatch) => {
		let err, response;
		dispatch({type: userConstants.CREATE_SUBSCRIPTION_PENDING});

		const path = '/subscription/refresh';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'POST'}}, status: 'Exception'},
			});
			throw err;
		}

		if (err) {
			errorDispatch(dispatch, handleError(err), userConstants.CREATE_SUBSCRIPTION_REJECTED);
			throw err;
		}

		dispatch({type: userConstants.CREATE_SUBSCRIPTION_FULFILLED, payload: response});
		return response;
	};
}

export function delayedCancelSubscription() {
	return async (dispatch) => {
		let err, response;
		dispatch({type: userConstants.DELAYED_CANCEL_PENDING});

		const payload = {
			cancellation_message: 'No longer interested',
			reason_code: 'NI',
		};

		const path = '/subscription/delayed-cancel';
		try {
			[err, response] = await _rePost(path, payload);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'POST'}}, status: 'Exception'},
			});
			bugsnagClient.notify(new Error('Server error when trying to cancel subscription!'), {
				metadata: {error: err},
			});
			throw err;
		}

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), userConstants.DELAYED_CANCEL_REJECTED);
			bugsnagClient.notify(new Error('Failed to cancel subscription!'), {
				metadata: {error: err},
			});
			throw err;
		}

		dispatch({type: userConstants.DELAYED_CANCEL_FULFILLED, payload: response});
		return response;
	};
}

export function closeWelcomeMessage() {
	return async (dispatch) => {
		dispatch({type: userConstants.CLOSE_WELCOME_MESSAGE});
	};
}

export function fetchMarkedTastings() {
	return async (dispatch) => {
		dispatch({type: userConstants.FETCH_MARKED_TASTINGS_PENDING});

		let err, response;
		const path = '/tastings/marked';

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {
						path,
						options: {method: 'GET'},
						url: routeConstants.MY_TASTINGS,
					},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			bugsnagClient.notify(new Error('Failed to fetch marked tastings.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: '/tastings/marked',
				},
			});
			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.FETCH_MARKED_TASTINGS_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: userConstants.FETCH_MARKED_TASTINGS_FULFILLED,
			payload: {tastings: response.data},
		});
	};
}

export function markTasting(wineRef, cb = () => {}) {
	return async (dispatch, getStore) => {
		const state = getStore();

		// prevents multiple concurrent requests
		if (state.requestStatus.MARK_TASTING_ === 'loading') {
			return;
		}

		dispatch({type: userConstants.MARK_TASTING_PENDING});

		let err, response;
		const path = `/tasting/${wineRef}/mark`;

		try {
			[err, response] = await _rePost(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: routeConstants.MY_TASTINGS},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			bugsnagClient.notify(new Error('Failed to mark tasting.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: `/tasting/${wineRef}/mark`,
				},
			});
			errorDispatch(dispatch, handleError(err, dispatch), userConstants.MARK_TASTING_REJECTED, err);
			return;
		}

		dispatch({type: userConstants.MARK_TASTING_FULFILLED, payload: response.data});
		cb && cb();
	};
}

export function unmarkTasting(wineRef, cb = () => {}) {
	return async (dispatch, getStore) => {
		const state = getStore();

		// prevents multiple concurrent requests
		if (state.requestStatus.UNMARK_TASTING === 'loading') {
			return;
		}

		dispatch({type: userConstants.UNMARK_TASTING_PENDING});

		let err, response;
		const path = await `/tasting/${wineRef}/unmark`;

		try {
			[err, response] = await _rePost(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: routeConstants.MY_TASTINGS},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			bugsnagClient.notify(new Error('Failed to unmark tasting.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: `/tasting/${wineRef}/unmark`,
				},
			});
			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				userConstants.UNMARK_TASTING_REJECTED,
				err
			);
			return;
		}

		dispatch({type: userConstants.UNMARK_TASTING_FULFILLED, payload: response.data});
		cb && cb();
	};
}

function handleLoginError(error, dispatch = null) {
	let payload = {error: {message: 'error_on_server'}};
	if (error) {
		payload = {error: {message: error.message}};

		if (error.response && error.response.status === 404) {
			payload = {error: {message: 'Requested URL not found.'}};
		}

		if (error.status === 503) {
			return window.location.replace(routeConstants.MAINTENANCE);
		}
		if (isUserUnauthorized(error)) {
			payload = {error: {message: 'error_invalid_credentials'}, showForgotPassword: true};
		} else if (error.data) {
			payload = {error: {message: error.response.data.message}};
		} else if (error.customError) {
			payload = {error: {message: error.customError}};
		}
	} else {
		payload = {error: {message: error.message}};
	}

	if (dispatch) {
		return dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: payload});
	}

	return {...payload, request: error.request};
}

function errorDispatch(dispatch, payload, type = '', error) {
	if (payload) {
		dispatch({type: type, payload: payload, error});
	}
}
