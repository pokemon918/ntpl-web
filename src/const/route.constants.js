const routeConstants = {
	// Home route
	HOME: '/',

	// Sign up and sign in process
	SIGN_UP: '/sign-up',
	SIGNUP: '/signup',

	SIGN_IN: '/sign-in',
	SIGNIN: '/signin',
	LOG_IN: '/log-in',
	LOGIN: '/login',

	LOGOUT: '/logout',
	LOG_OUT: '/log-out',

	RESET_PASSWORD: '/reset/password',
	RESET_TOKEN: '/reset',

	// User profile
	PROFILE: '/profile',
	CHANGE_PASSWORD: '/profile/change-password',

	// Everything related to subscription
	PRICE_COMPARE: '/app/price',
	SUBSCRIPTION: '/profile/subscription',
	SUBSCRIPTION_UPDATED: '/profile/subscription/updated',
	BILLING: '/profile/billing',
	PAYMENT: '/profile/payment',
	WELCOME_THANK_YOU: '/profile/welcome',

	// Tasting module
	MY_TASTINGS: '/tastings',
	TASTING_RESULT_REF: '/tasting/:wineRef',
	TASTING: '/tasting',
	NEW_TASTING: '/tasting/new',
	NEW_TASTING_TYPE: '/tasting/new/:type',
	NEW_TASTING_RESULT: '/tasting/new/summary',
	EDIT_TASTING: '/tasting/:ref/:type',
	TASTING_RESULT: '/tasting/result',
	NEW_EVENT_TASTING: '/event/:ref/tasting/:tastingRef',
	NEW_PRODUCT_TASTING: '/new-product-tasting',

	// Events module
	EVENT: '/event',
	EVENTS: '/events',
	EVENT_NEW: '/event/new',
	MY_EVENTS: '/events/mine',
	EVENT_REF: '/event/:eventRef',
	EVENT_REF_TASTINGS: '/event/:eventRef/tastings',

	//  Teams module
	TEAM: '/team',
	MY_TEAMS: '/teams',
	FIND_TEAMS: '/teams/find',
	TEAM_HANDLE: '/team/:teamRef',

	// Teams Events module
	TEAM_EVENTS_NEW: '/team/:teamRef/events/new',

	// All demos
	DEMO_AUTOSUGGEST: '/demo/autosuggest',
	DEMO_SEARCH: '/demo/search',
	DEMO_WINE_LIST: '/demo/wine-list',
	DEMO_CHANGE_PAYMENT: '/demo/change-payment',
	DEMO_SUBSCRIBE: '/demo/subscribe',

	// System pages
	NOT_FOUND: '/app/not-found/404',
	ERROR_CANNOT_RECOVER: '/app/error',
	DEVELOPMENT_SETTINGS: '/app/config',
	MAINTENANCE: '/app/info',
	APP_RESET: '/app/reset',
	PRIVATE_MODE_ERROR: '/app/private-mode',

	// Contest
	CONTEST_PAGE: '/contest',
	CONTEST: '/contest/:ref',
	CONTEST_ARRIVAL: '/contest/:ref/arrival',
	CONTEST_TEAM: '/contest/:ref/access/team',
	CONTEST_PROGRESS: '/contest/:ref/progress',
	CONTEST_DISTRIBUTION: '/contest/:ref/distribution',
	CONTEST_ASSESSMENT: '/contest/:ref/final-assessment',
	CONTEST_RESULT: '/contest/:ref/result',
	CONTEST_TROPHY: '/contest/:ref/trophy',
	CONTEST_TEAM_STATEMENT: '/contest/:ref/team-assessment',
	CONTEST_TEAM_DASHBOARD: '/contest/:ref/collection/:collection/team/:teamRef',
};

export default routeConstants;
