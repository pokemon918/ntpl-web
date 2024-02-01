import {signPath} from 'commons/commons';
import {appConstants, eventsConstants} from 'const';
import {_reGet, handleError, escapeHtml} from 'commons/commons';
import storage from 'redux-persist/lib/storage';
import {_upload} from '../commons/commons';

export function fetchTeams() {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_TEAMS_PENDING});

		let err, response;
		const path = '/teams';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.FETCH_EVENTS_REJECTED,
				err
			);
			return;
		}

		let eventsData = response.data;
		dispatch({type: eventsConstants.FETCH_TEAMS_FULFILLED, payload: {data: eventsData}});
	};
}

export function fetchEvents(history) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_EVENTS_PENDING});

		let err, response;
		const path = '/events';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}},
					status: 'Exception',
					url: '/events',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_fetchEvent';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.FETCH_EVENTS_REJECTED,
				err
			);
			return;
		}

		let eventsData = response.data;
		storage.setItem('events', JSON.stringify(eventsData));
		dispatch({type: eventsConstants.FETCH_EVENTS_FULFILLED, payload: {data: eventsData}});
	};
}

export function fetchEventsFeatured(history) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_FEATURED_EVENTS_PENDING});

		let err, response;
		const path = `/events/featured`;
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: '/events'},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_featuredEvent';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.FETCH_FEATURED_EVENTS_REJECTED,
				err
			);
			return;
		}

		let eventsData = response.data;
		dispatch({type: eventsConstants.FETCH_FEATURED_EVENTS_FULFILLED, payload: eventsData});
	};
}

export function fetchMyEvents(history) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_MY_EVENTS_PENDING});

		let err, response;
		const path = '/my-events';
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: '/my-events'},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_fetchEvents.';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.FETCH_MY_EVENTS_REJECTED,
				err
			);

			return;
		}

		const myEventsData = response.data;
		dispatch({type: eventsConstants.FETCH_MY_EVENTS_FULFILLED, payload: {data: myEventsData}});
	};
}

export function addEvent(eventData, addEventCallback = false, history) {
	eventData.description = escapeHtml(eventData.description);
	eventData.name = escapeHtml(eventData.name);

	return async (dispatch) => {
		dispatch({type: eventsConstants.CREATE_PENDING, payload: null});

		const path = '/event';

		const normalizedEventData = {
			...eventData,
			metadata: eventData.metadata,
		};

		if (addEventCallback) {
			addEventCallback();
		}

		const signedPath = await signPath(path, 'POST');

		dispatch({
			type: eventsConstants.CREATE_SUCCESS,
			payload: {
				eventData: normalizedEventData,
				ref: normalizedEventData.name,
			},
			meta: {
				offline: {
					// the network action to execute:
					effect: {url: signedPath, method: 'POST', json: {...normalizedEventData}},
					// action to dispatch when effect succeeds:
					commit: {
						type: `${eventsConstants.CREATE_SUCCESS}_COMMIT`,
					},
					// action to dispatch if network action fails permanently:
					rollback: {
						type: `${appConstants.OPEN_APP_ERROR_MODAL}`,
						error: {
							request: {path: signedPath, options: {method: 'POST', body: normalizedEventData}},
						},
					},
				},
			},
		});
	};
}

export function addEventImage(ref, data) {
	return async (dispatch) => {
		const signedPath = await signPath(`/event/${ref}`, 'POST');
		let err, response;
		try {
			[err, response] = await _upload(signedPath, data);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: signedPath, options: {method: 'POST'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_addEventImage';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.ADD_EVENT_IMAGE_REJECTED,
				err
			);
			return;
		}

		const myEventData = response.data;
		dispatch({type: eventsConstants.ADD_EVENT_IMAGE_SUCCESS, payload: myEventData});
	};
}

/**
 * Action to add dummy data to the store when selected.
 * @param {*} eventRef
 * @param {*} event
 */
export function addSelectedEvent(event) {
	return async (dispatch) => {
		dispatch({
			type: eventsConstants.FETCH_SELECTED_EVENT,
			payload: {data: event},
		});
	};
}

export function fetchSelectedEvent(eventRef, history) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_SELECTED_EVENT_PENDING});

		let err, response;
		const path = `/event/${eventRef}`;
		try {
			[err, response] = await _reGet(path);
		} catch (error) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}, url: `/ tasting / ${eventRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_fetchEvents';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.FETCH_SELECTED_EVENT_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: eventsConstants.FETCH_SELECTED_EVENT_FULFILLED,
			payload: {data: response.data},
		});
		return response.data;
	};
}

export function attendEvent(eventRef) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.ATTEND_EVENT_PENDING});

		let err, response;
		const path = `/event/${eventRef}`;

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_attendEvent';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				eventsConstants.ATTEND_EVENT_REJECTED,
				err
			);
			return;
		}

		let data = response.data;

		if (data && data.event_tastings) {
			dispatch({
				type: eventsConstants.ATTEND_EVENT_FULFILLED,
				payload: {
					selectedEvent: eventRef,
					data: data,
				},
			});
		} else if (data && data.ref) {
			dispatch({
				type: eventsConstants.ATTEND_EVENT_REDIRECT_OWNER,
				payload: {
					selectedEvent: eventRef,
					data: data,
				},
			});
		}
	};
}

export function resetEventShowcase() {
	return async (dispatch) => {
		dispatch({type: eventsConstants.RESET_EVENT_SHOWCASE});
	};
}

export function setTastingShowcaseData(type, selectedTasting, eventRef) {
	return async (dispatch) => {
		dispatch({
			type: eventsConstants.SET_TASTING_SHOWCASE_DATA,
			payload: {
				type: type,
				selectedTasting: selectedTasting,
				eventRef: eventRef,
			},
		});
	};
}

export function setEventPreventReload(data) {
	return (dispatch) => {
		dispatch({
			type: eventsConstants.SET_EVENT_PREVENT_RELOAD,
			payload: data,
		});
	};
}

function errorDispatch(dispatch, payload, type = '', error) {
	dispatch({type: type, payload: {error: payload}, error});
}
