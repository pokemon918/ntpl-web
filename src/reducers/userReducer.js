import {appConstants, userConstants} from 'const';
import {defaultLanguage} from 'const/languages';
import {getNormalizeSubscriptionUrls} from './functions/normalizeSubscriptionUrls';
import {createLoadingSelector} from './requestStatusReducer';

const defaultData = {
	isFirstLoggedIn: false,
	isLoggedIn: false,
	userData: {},
	error: null,
	message: '',
	isLoading: false,
	status: null,
	selectedType: 'account',
	showForgotPassword: false,
	passwordChange: false,
	passwordReset: null,
	language: defaultLanguage,
	activePlan: null,
	futurePlan: null,
	subscriptionUrl: null,
	subscriptionStatus: 'new',
	subscriptionEndDate: null,
	markedTastings: {},
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			return {...state, isLoading: false, error: null};
		}

		case userConstants.CLEAR_LOGIN_DATA:
			return defaultData;

		case appConstants.SERVER_ERROR:
			return {...state, isLoading: false};

		case userConstants.LOGIN_FULFILLED: {
			let data = Object.assign({}, state, {
				isLoggedIn: true,
				userData: action.payload,
			});
			return data;
		}
		case userConstants.LOGIN_FAILED: {
			let error = action.payload && action.payload.error ? action.payload.error : null;
			let showForgotPassword =
				action.payload && action.payload.showForgotPassword
					? action.payload.showForgotPassword
					: false;

			let data = Object.assign({}, state, {
				isLoggedIn: false,
				error: {login: error},
				showForgotPassword: showForgotPassword,
			});
			return data;
		}
		case userConstants.INITIATE_LOGOUT: {
			let data = Object.assign({}, state, defaultData);
			return data;
		}
		case userConstants.CREATE_SUCCESS: {
			let data = Object.assign({}, state, {
				isLoading: false,
				message: action.payload.message,
				status: {reg: action.payload.status},
				isFirstLoggedIn: true,
				activePlan:
					(action.payload.data.subscription && action.payload.data.subscription.active_plan) ||
					'view',
			});
			return data;
		}
		case userConstants.CREATE_ERROR: {
			let error = action.payload && action.payload.error ? action.payload.error : null;
			let data = Object.assign({}, state, {
				error: error && error.message,
				isLoading: false,
			});
			return data;
		}
		case userConstants.RESET_PASS_SUCCESS: {
			let data = Object.assign({}, state, {passwordReset: action.payload, isLoading: false});
			return data;
		}

		case userConstants.GET_SUBSCRIPTION_PLAN_FULFILLED: {
			let data = Object.assign({}, state, {
				subscriptionUrl: getNormalizeSubscriptionUrls(action),
				isLoading: false,
			});
			return data;
		}

		case userConstants.CLEAR_RESET_PASS: {
			let data = Object.assign({}, state, {passwordReset: null, isLoading: false});
			return data;
		}

		case userConstants.CHANGE_LANGUAGE: {
			return {...state, language: action.payload};
		}

		case userConstants.FETCH_USER_PROFILE_ERROR: {
			return {...state, isLoading: false};
		}

		case userConstants.UPDATE_USER_INFO_PENDING:
		case userConstants.FETCH_USER_PROFILE_PENDING: {
			return {...state, isLoading: true};
		}

		case userConstants.UPDATE_USER_INFO_ERROR: {
			return {...state, isLoading: false, error: action.payload.error.message};
		}

		case userConstants.FETCH_USER_PROFILE_SUCCESS: {
			const subscriptionStatus = action.payload.subscription && action.payload.subscription.status;
			const subscriptionCancelledDate =
				action.payload.subscription && action.payload.subscription.delayed_cancel_at;

			return {
				...state,
				userData: normalizeUserData(action.payload),
				activePlan: subscriptionStatus ? state.activePlan : 'subscribe',
				subscriptionStatus: subscriptionCancelledDate ? 'cancelled' : subscriptionStatus,
				subscriptionEndDate: subscriptionCancelledDate,
				isLoading: false,
				error: '',
			};
		}

		case userConstants.UPDATE_USER_INFO_SUCCESS: {
			return {
				...state,
				userData: normalizeUserData(action.payload.data.user),
				isLoading: false,
				error: '',
			};
		}

		case userConstants.SET_USER_ACTIVE_SETTING: {
			return {
				...state,
				selectedType: action.payload,
				isLoading: false,
			};
		}

		case userConstants.CHANGE_USER_EMAIL_SUCCESS: {
			let data = action.payload;
			return {...state, email: data, isLoading: false};
		}

		case userConstants.CHANGE_USER_PASSWORD_SUCCESS: {
			let data = Object.assign({}, state, {passwordChange: true, isLoading: false});
			return data;
		}

		case userConstants.CLOSE_WELCOME_MESSAGE:
			return {...state, isFirstLoggedIn: false};

		case userConstants.USER_PASSWORD_CHANGED: {
			return {...state, passwordChange: action.payload};
		}

		case userConstants.INITIATE_LOGIN:
		case userConstants.CREATE_PENDING:
			return {...state, isLoading: true};

		case userConstants.GET_ACTIVE_PLAN_FULFILLED: {
			const subscriptionInfo = action.payload && action.payload.data;

			return {
				...state,
				subscriptionStatus: subscriptionInfo && subscriptionInfo.status,
				activePlan: subscriptionInfo && subscriptionInfo.active_plan,
				futurePlan: subscriptionInfo && subscriptionInfo.future_plan,
			};
		}

		case userConstants.CREATE_SUBSCRIPTION_FULFILLED: {
			const newSubscription = action.payload?.data?.data;

			return {
				...state,
				subscriptionStatus: newSubscription?.status,
				activePlan: newSubscription?.active_plan,
				futurePlan: newSubscription?.future_plan,
			};
		}

		case userConstants.DELAYED_CANCEL_FULFILLED:
			return {
				...state,
				subscriptionStatus: 'cancelled',
				subscriptionEndDate: action.payload.data.data && action.payload.data.data.delayed_cancel_at,
			};

		case userConstants.FETCH_MARKED_TASTINGS_FULFILLED: {
			const markedTastings = {};
			action.payload.tastings.forEach((ref) => {
				markedTastings[ref] = true;
			});
			return {
				...state,
				markedTastings,
			};
		}

		case userConstants.MARK_TASTING_FULFILLED: {
			const {
				data: {impression_ref: wineRef},
			} = action.payload;
			return {
				...state,
				markedTastings: {
					...state.markedTastings,
					[wineRef]: true,
				},
			};
		}

		case userConstants.UNMARK_TASTING_FULFILLED: {
			const {
				data: {impression_ref: wineRef},
			} = action.payload;
			return {
				...state,
				markedTastings: {
					...state.markedTastings,
					[wineRef]: false,
				},
			};
		}

		default:
			return state;
	}
}

function normalizeUserData(userData) {
	return {
		...userData,
		educations: userData.educations.map((education) => ({
			...education,
			status: education.completed ? 'graduated' : 'ongoing',
		})),
	};
}

export const unMarkLoadingSelector = createLoadingSelector('UNMARK_TASTING');
export const markLoadingSelector = createLoadingSelector('MARK_TASTING');
