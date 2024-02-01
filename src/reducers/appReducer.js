import storage from 'redux-persist/lib/storage';

import {appConstants, multiStepFormConstants, userConstants, routeConstants} from 'const';
import {getLinkWithArguments, isLocalhost} from 'commons/commons';

const defaultData = {
	isSideNavOpen: false,
	isOffCanvas: false,
	offCanvasClass: '',
	preservedUrl: '',
	advancedOptions: {
		serverUrl: defaultApiUrl(),
		demoMode: false,
		fullVersion: false, // isLocalhost(),
	},
	logs: [],
	subscription: {
		voucher: '',
		type: {id: 'scholar', name: 'Scholar'},
		skipSelectPlan: false,
		duration: '1',
		paymentMode: false,
		currentState: userConstants.SIGN_UP_PAGE,
	},
	isSaving: false,
	serverError: false,
	showSubscriptionWarning: false,
	afterSaveUrl: '',
	loadingText: '',
	initiatedLogout: false,
	redirectToSubscription: false,
};

function defaultApiUrl() {
	const url = new URL(window.location.href);
	const host = window.location.hostname;
	const param = url.searchParams.get('api');
	if (param && param !== 'undefined') {
		return param;
	}
	if (isLocalhost()) return `http://${window.location.hostname}:8000`;

	if (window.location.hostname === 'test.ntbl.link') {
		return 'https://test2-api.ntbl.link';
	}

	if (/^demo.noteable\.co$/.test(host)) {
		return 'https://demo-api.ntbl.link';
	}

	if (/noteable\.co$/.test(host)) {
		return 'https://v2.ntbl-api.eu';
	}

	return 'https://ci-api.ntbl.link';
}

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.CLEAR_AFTER_SAVE:
			return {...state, afterSaveUrl: ''};

		case appConstants.SAVE_COMPLETE:
			return defaultData;

		case appConstants.CLOSE_SIDENAV:
			return {...state, isSideNavOpen: false};

		case appConstants.SET_NAV_OFFCANVAS:
			return {
				...state,
				isOffCanvas: action.payload.isOffCanvas,
				offCanvasClass: action.payload.offCanvasClass,
			};

		case appConstants.SET_ADVANCED_OPTIONS: {
			let data = Object.assign({}, state.advancedOptions, action.payload);
			return {...state, advancedOptions: data};
		}

		case appConstants.PRESERVE_URL: {
			return {...state, preservedUrl: action.payload};
		}

		case appConstants.SHOW_SUBSCRIPTION_WARNING: {
			return {...state, showSubscriptionWarning: action.payload};
		}

		case appConstants.SET_SUBSCRIPTION_TYPE: {
			return {
				...state,
				subscription: {
					...state.subscription,
					type: action.payload.type,
				},
			};
		}

		case appConstants.SET_SKIP_SELECT_PLAN: {
			return {
				...state,
				subscription: {
					...state.subscription,
					skipSelectPlan: action.payload.skipSelectPlan,
				},
			};
		}

		case appConstants.SET_SUBSCRIPTION_URL: {
			return {
				...state,
				redirectToSubscription: action.payload,
			};
		}

		case appConstants.SET_SUBSCRIPTION_DURATION: {
			return {
				...state,
				subscription: {
					...state.subscription,
					duration: action.payload,
				},
			};
		}

		case appConstants.SET_VOUCHER: {
			return {
				...state,
				subscription: {
					...state.subscription,
					voucher: action.payload,
				},
			};
		}

		case appConstants.SET_PAYMENT_MODE: {
			return {
				...state,
				subscription: {
					...state.subscription,
					paymentMode: action.payload,
				},
			};
		}

		case appConstants.SET_CURRENT_STATE: {
			return {
				...state,
				subscription: {
					...state.subscription,
					currentState: action.payload,
				},
			};
		}

		case multiStepFormConstants.SUBMIT_START:
			return {...state, isSaving: true, afterSaveUrl: ''};

		case multiStepFormConstants.SUBMIT_FULFILLED:
			storage.removeItem('multiStepForm');

			return {
				...state,
				isSaving: false,
				afterSaveUrl: `${routeConstants.TASTING_RESULT}/${action.payload.ref}`,
				loadingText: action.payload.loadingText,
			};

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`: {
			return {
				...state,
				isSaving: false,
				afterSaveUrl: getLinkWithArguments(routeConstants.TASTING_RESULT_REF, {
					wineRef: action.payload.data.ref,
				}),
			};
		}

		case multiStepFormConstants.SUBMIT_ERROR:
			return {
				...state,
				afterSaveUrl: action.payload.afterSaveUrl,
				loadingText: action.payload.loadingText,
			};

		case userConstants.LOGIN_FULFILLED:
			return {...state, initiatedLogout: false};

		case userConstants.INITIATE_LOGIN:
			return {...state, initiatedLogout: true, isSideNavOpen: false};

		case userConstants.INITIATE_LOGOUT:
			return {...state, logs: []};

		case appConstants.STORE_ERROR_LOG:
			const logs = state.logs || [];
			return {...state, logs: [...logs, action.payload]};

		case appConstants.READ_ERROR_LOG:
			return {
				...state,
				logs: state.logs.map((detail) =>
					detail.ref === action.payload.ref ? {...detail, read: true} : detail
				),
			};

		case userConstants.LOGIN_FAILED:
			return {...state, initiatedLogout: true, isSideNavOpen: false};

		default:
			return state;
	}
}

// todo: refactor nav related values into it's own sub-object of the app object
