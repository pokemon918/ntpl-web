import dateFns from 'date-fns';
import get from 'lodash/get';
import bugsnagClient from 'config/bugsnag';
import {eventsConstants, appConstants, contestConstants} from 'const';
import {jsonFromApi} from '../commons/commons';

const defaultData = {
	data: [],
	myEvents: [],
	searchedContest: null,
	featuredEvents: [],
	error: null,
	isLoading: false,
	errorFeaturedEvents: null,
	isSaving: false,
	status: null,
	attendEventPermitted: false,
	redirectOwner: false,
	showCaseData: [],
	selectedEvent: null,
	preventReload: false,
	tastingShowCaseData: {
		selectedTasting: null,
		type: '',
		eventRef: '',
	},
	createdEventRef: '',
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			return {...state, isSaving: false, error: null};
		}

		case eventsConstants.FETCH_EVENTS_PENDING: {
			let data = Object.assign({}, state, {
				isLoading: true,
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.FETCH_EVENTS_FULFILLED: {
			const events = action.payload.data;
			let data = Object.assign({}, state, {
				data: events,
				status: null,
				isLoading: false,
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
				error: null,
			});
			return data;
		}

		case eventsConstants.FETCH_EVENTS_REJECTED: {
			bugsnagClient.notify(new Error('Failed to fetch events.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {
				data: [],
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
				error: action.payload,
			});
			return data;
		}

		case eventsConstants.FETCH_FEATURED_EVENTS_PENDING:
			return {
				...state,
				errorFeaturedEvents: null,
			};

		case eventsConstants.SET_EVENT_PREVENT_RELOAD:
			return {
				...state,
				preventReload: action.payload,
			};

		case contestConstants.SEARCH_EVENTS_PENDING:
			return {
				...state,
				isLoading: true,
			};

		case contestConstants.SEARCH_EVENTS_FULFILLED:
		case contestConstants.SEARCH_CONTEST_ERROR:
			return {
				...state,
				isLoading: false,
			};

		case eventsConstants.FETCH_FEATURED_EVENTS_FULFILLED:
			return {
				...state,
				featuredEvents: action.payload,
			};

		case eventsConstants.FETCH_FEATURED_EVENTS_REJECTED:
			bugsnagClient.notify(new Error('Failed to fetch featured events.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			return {
				...state,
				errorFeaturedEvents: action.payload,
				featuredEvents: [],
			};

		case eventsConstants.FETCH_MY_EVENTS_PENDING:
			return {
				...state,
				error: null,
			};

		case eventsConstants.FETCH_MY_EVENTS_FULFILLED:
			return {
				...state,
				myEvents: action.payload.data,
				errorMyEvents: null,
			};

		case eventsConstants.FETCH_MY_EVENTS_REJECTED:
			bugsnagClient.notify(new Error('Failed to fetch my events.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			return {
				...state,
				errorMyEvents: action.payload,
				myEvents: [],
			};

		case eventsConstants.CREATE_PENDING: {
			let data = Object.assign({}, state, {
				isSaving: true,
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.CREATE_SUCCESS: {
			const payload = Object.assign({}, action.payload.eventData, {
				start_date: dateFns.format(action.payload.eventData.start_date, 'YYYY-MM-DD HH:MM:SS'),
				end_date: dateFns.format(action.payload.eventData.end_date, 'YYYY-MM-DD HH:MM:SS'),
			});

			let newlyCreatedEvent = Object.assign({}, payload, {
				ref: action.payload.ref,
			});

			let newEvents = JSON.parse(JSON.stringify(state.myEvents));

			newEvents.push(newlyCreatedEvent);
			let data = Object.assign({}, state, {
				myEvents: newEvents,
				isSaving: false,
				status: 'success',
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});

			return data;
		}

		case eventsConstants.ADD_EVENT_IMAGE_SUCCESS: {
			let newEvents = JSON.parse(JSON.stringify(state.myEvents));

			newEvents = newEvents.map((event) => {
				if (event.name === action.payload.data.name && event.ref === action.payload.data.ref) {
					return action.payload.data;
				}

				return event;
			});

			let data = Object.assign({}, state, {
				myEvents: newEvents,
				createdEventRef: '',
			});

			return data;
		}

		case `${eventsConstants.CREATE_SUCCESS}_COMMIT`: {
			let newEvents = JSON.parse(JSON.stringify(state.myEvents));

			newEvents = newEvents.map((event) => {
				if (
					event.name === action.payload.data.name &&
					event.description === action.payload.data.description
				) {
					return action.payload.data;
				}

				return event;
			});

			let data = Object.assign({}, state, {
				myEvents: newEvents,
				isSaving: false,
				status: 'success',
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
				createdEventRef: action.payload.data.ref,
			});

			return data;
		}

		case eventsConstants.CREATE_ERROR: {
			let data = Object.assign({}, state, {
				isSaving: false,
				status: 'error',
				error: action.payload.error,
				attendEventPermitted: false,
				redirectOwner: false,
			});

			return data;
		}

		case eventsConstants.ATTEND_EVENT_FULFILLED: {
			let data = Object.assign({}, state, {
				attendEventPermitted: true,
				redirectOwner: false,
				showCaseData: action.payload.data,
				selectedEvent: action.payload.selectedEvent,
			});
			return data;
		}

		case eventsConstants.ATTEND_EVENT_REDIRECT_OWNER: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: true,
				showCaseData: action.payload.data,
				selectedEvent: action.payload.selectedEvent,
			});
			return data;
		}

		case eventsConstants.ATTEND_EVENT_REJECTED: {
			bugsnagClient.notify(new Error('Failed to attend event.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
			});
			return data;
		}

		case eventsConstants.RESET_EVENT_SHOWCASE: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.SET_TASTING_SHOWCASE_DATA: {
			let data = Object.assign({}, state, {
				tastingShowCaseData: {
					selectedTasting: action.payload.selectedTasting,
					type: action.payload.type,
					eventRef: action.payload.eventRef,
				},
			});
			return data;
		}

		default:
			return state;
	}
}

export function getEventMetadata(state, ref) {
	const event = state.events.data.find((event) => event.ref === ref);
	try {
		return jsonFromApi(event.metadata);
	} catch (err) {
		return null;
	}
}
