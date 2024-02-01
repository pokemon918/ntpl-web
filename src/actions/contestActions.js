import {errorDispatch} from './appActions';
import {handleError, _rePost, _reGet} from 'commons/commons';
import {appConstants, contestConstants} from 'const';

export function fetchContest(ref) {
	return async (dispatch, getStore) => {
		const state = getStore();

		// prevents multiple concurrent requests
		if (state.requestStatus.FETCH_CONTEST === 'loading') {
			return;
		}

		dispatch({type: contestConstants.FETCH_CONTEST_PENDING});
		let err, response;
		const path = `/contest/${ref}`;
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({type: contestConstants.FETCH_CONTEST_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchContestRef';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.FETCH_CONTEST_ERROR,
				err
			);
			return;
		}

		let contestInfo = response?.data?.data;
		dispatch({
			type: contestConstants.FETCH_CONTEST_SUCCESS,
			payload: {
				data: contestInfo, // backwards compatibility, remove along with `contest` reducer
				contestRef: ref,
				contestInfo: contestInfo,
			},
		});
	};
}

export function onAcceptUser(ref, participantInfo) {
	return async (dispatch, getState) => {
		dispatch({
			type: contestConstants.ADD_USER_CONTEST_PENDING,
			payload: {contestRef: ref, participantInfo},
		});

		let err;
		let path = `/contest/${ref}/accept/user/${participantInfo.user_ref}`;
		try {
			[err] = await _rePost(path);
		} catch (err) {
			dispatch({type: contestConstants.ADD_USER_CONTEST_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_addUserContest';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.ADD_USER_CONTEST_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.ADD_USER_CONTEST_SUCCESS,
			payload: {contestRef: ref, participantInfo},
		});
	};
}

export function rejectContestRequest(contestRef, teamRef, participantInfo) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.REJECT_USER_CONTEST,
			payload: {contestRef, participantInfo},
		});

		const path = `/team/${teamRef}/decline/${participantInfo.ref}`;

		try {
			await _rePost(path);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}
	};
}

export function fetchContestStatementSummary(contestRef, teamRef) {
	return async (dispatch) => {
		dispatch({type: contestConstants.FETCH_CONTEST_STATEMENT_SUMMARY_PENDING});

		let err, response;
		let path = `/contest/${contestRef}/team/${teamRef}/statements/summary`;

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({type: contestConstants.FETCH_CONTEST_STATEMENT_SUMMARY_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchContestStatementSummaryRef';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.FETCH_CONTEST_STATEMENT_SUMMARY_ERROR,
				err
			);
			return;
		}

		let statementData = response?.data?.data;
		dispatch({
			type: contestConstants.FETCH_CONTEST_STATEMENT_SUMMARY_SUCCESS,
			payload: {contestRef, data: statementData},
		});
	};
}

export function fetchRequestForContest(ref) {
	return async (dispatch) => {
		dispatch({type: contestConstants.FETCH_CONTEST_REQUEST_PENDING});

		let err, response;
		const path = `/team/${ref}/join/pending`;
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({type: contestConstants.FETCH_CONTEST_REQUEST_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchContestRequest';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.FETCH_CONTEST_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.FETCH_CONTEST_REQUEST_SUCCESS,
			payload: {contestRef: ref, data: response.data},
		});
	};
}

export function updateContestRole(contestRef, userRef, roleKey) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.UPDATE_CONTEST_ROLE_PENDING,
			payload: {contestRef, participantInfo: {ref: userRef, role: roleKey}},
		});

		let err;
		let path = `/contest/${contestRef}/let/${userRef}/be/${roleKey}`;
		try {
			[err] = await _rePost(path);
		} catch (err) {
			dispatch({type: contestConstants.UPDATE_CONTEST_ROLE_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'POST'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_updatingContestRole';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.UPDATE_CONTEST_ROLE_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.UPDATE_CONTEST_ROLE_SUCCESS,
			payload: {contestRef, participantInfo: {ref: userRef, role: roleKey}},
		});
	};
}

/**
 * @param {*} payload { collection, teamRef, ref, field, value }
 */
export function updateContestStatement(input) {
	const {ref: contestRef, collection: collectionRef, teamRef, wineRef, field} = input;
	const payload = {
		contestRef,
		collectionRef,
		teamRef,
		wineRef,
		field,
	};

	return async (dispatch) => {
		if (input.role === 'admin') {
			dispatch({type: contestConstants.UPDATE_ADMIN_CONTEST_STATEMENT_PENDING, payload});
		} else {
			dispatch({type: contestConstants.UPDATE_CONTEST_STATEMENT_PENDING, payload});
		}

		let err;
		const path = `/contest/${input.ref}/collection/${input.collection}/team/${input.teamRef}/subject/${input.wineRef}/statement`;
		try {
			const data = {
				...input.field, // { metadata: { marked_statements: [] } }
			};
			[err] = await _rePost(path, data);
		} catch (err) {
			dispatch({
				type: contestConstants.UPDATE_CONTEST_STATEMENT_ERROR,
				error: err,
			});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}},
					status: 'Exception',
				},
			});
		}

		if (err) {
			err.customError = 'error_updatingContestStatement';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.UPDATE_CONTEST_STATEMENT_ERROR,
				err
			);
			return;
		}

		if (input.role === 'admin') {
			dispatch({type: contestConstants.UPDATE_ADMIN_CONTEST_STATEMENT_SUCCESS, payload});
		} else {
			dispatch({type: contestConstants.UPDATE_CONTEST_STATEMENT_SUCCESS, payload});
		}
	};
}

export function updateContestTeam(contestRef, userRef, roleKey, divisionRef) {
	return async (dispatch) => {
		const newDivisionRef = roleKey === 'remove' ? null : roleKey;
		dispatch({
			type: contestConstants.UPDATE_CONTEST_TEAM_PENDING,
			payload: {contestRef, participantInfo: {ref: userRef, division: newDivisionRef}},
		});

		let err, path;
		path = `/contest/${contestRef}/put/${userRef}/on/${roleKey}`;

		if (roleKey === 'remove') {
			path = `/contest/${contestRef}/remove/${userRef}/from/${divisionRef}`;
		}

		try {
			[err] = await _rePost(path);
		} catch (err) {
			dispatch({type: contestConstants.UPDATE_CONTEST_TEAM_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'POST'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'The change could not be saved';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.UPDATE_CONTEST_TEAM_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.UPDATE_CONTEST_TEAM_SUCCESS,
			payload: {contestRef, participantInfo: {ref: userRef, division: newDivisionRef}},
		});
	};
}

export function fetchTeamProgress(contestRef, teamRef, conf = {}) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.FETCH_ADMIN_PROGRESS_PENDING,
			payload: {contestRef},
		});

		const path = `/contest/${contestRef}/team/${teamRef}/progress`;
		let err, response;

		try {
			[err, response] = await _reGet(path, conf);

			if (err) {
				return dispatch({
					type: contestConstants.FETCH_ADMIN_PROGRESS_ERROR,
					payload: {data: null},
				});
			}
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path: path, options: {method: 'GET'}},
					status: 'Exception',
					url: '/contest',
				},
			});

			throw err;
		}
		dispatch({
			type: contestConstants.FETCH_ADMIN_PROGRESS_SUCCESS,
			payload: {
				teamRef,
				data: [response?.data?.data],
			},
		});
	};
}

export function searchContest(keyword) {
	return async (dispatch) => {
		const CONTEST_HANDLE_LENGTH = 6;

		dispatch({type: contestConstants.SEARCH_CONTEST_PENDING});

		let err, response;
		if (keyword.length < CONTEST_HANDLE_LENGTH) {
			return; /*dispatch({
				type: contestConstants.SEARCH_CONTEST_SUCCESS,
				payload: {data: null},
			});*/
		}

		const path = `/contest/search/handle/${keyword}`;

		try {
			[err, response] = await _reGet(path);

			if (err) {
				return dispatch({
					type: contestConstants.SEARCH_CONTEST_SUCCESS,
					payload: {data: null},
				});
			}
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}},
					status: 'Exception',
					url: '/events',
				},
			});

			throw err;
		}

		dispatch({
			type: contestConstants.SEARCH_CONTEST_SUCCESS,
			payload: {data: response?.data?.data},
		});
	};
}

export function fetchContestTeamLeader(contestRef, collectionRef, divisionRef) {
	return async (dispatch) => {
		dispatch({type: contestConstants.FETCH_CONTEST_TEAM_LEADER_PENDING});

		let err, response;
		const path = `/contest/${contestRef}/collection/${collectionRef}/team/${divisionRef}/stats`;
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: contestConstants.FETCH_CONTEST_TEAM_LEADER_ERROR,
				payload: {data: 'error'},
			});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchContestRef';
			return dispatch({
				type: contestConstants.FETCH_CONTEST_TEAM_LEADER_ERROR,
				payload: {data: 'error'},
			});
		}

		let teamData = response?.data?.data;
		dispatch({
			type: contestConstants.FETCH_CONTEST_TEAM_LEADER_SUCCESS,
			payload: {contestRef, collectionRef, teamRef: divisionRef, data: teamData},
		});
	};
}

export function fetchContestTeamStats(contestRef, collectionRef, divisionRef) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.FETCH_CONTENT_STATS_PENDING,
			payload: {contestRef, collectionRef, divisionRef, status: 'pending'},
		});

		let err, response;
		const path =
			divisionRef !== contestRef
				? `/contest/${contestRef}/collection/${collectionRef}/team/${divisionRef}/stats`
				: `/contest/${contestRef}/collection/${collectionRef}/stats`;
		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({type: contestConstants.FETCH_CONTENT_STATS_ERROR, payload: {data: 'error'}});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_fetchContestRef';

			dispatch({
				type: contestConstants.FETCH_CONTENT_STATS_ERROR,
				payload: {contestRef, collectionRef, divisionRef, status: 'error', error: err},
			});
			return;
		}

		let data = response?.data?.data;
		dispatch({
			type: contestConstants.FETCH_CONTENT_STATS_SUCCESS,
			payload: {contestRef, collectionRef, teamRef: divisionRef, status: 'success', data},
		});
	};
}

export function updateTeamStatement(
	contestRef,
	collectionRef,
	divisionRef,
	impressionRef,
	payload
) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.UPDATE_TEAM_STATEMENT_PENDING,
			payload: {
				contestRef,
				collectionRef,
				teamRef: divisionRef,
				impressionRef,
				metadata: payload,
			},
		});

		let err;
		const path =
			divisionRef !== contestRef
				? `/contest/${contestRef}/collection/${collectionRef}/team/${divisionRef}/subject/${impressionRef}/statement`
				: `/contest/${contestRef}/collection/${collectionRef}/subject/${impressionRef}/statement`;
		try {
			[err] = await _rePost(path, payload);
		} catch (err) {
			dispatch({type: contestConstants.UPDATE_TEAM_STATEMENT_ERROR, error: err});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path: path, options: {method: 'POST'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_updateTeamStatement';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.UPDATE_TEAM_STATEMENT_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.UPDATE_TEAM_STATEMENT_SUCCESS,
			payload: {
				contestRef,
				collectionRef,
				teamRef: divisionRef,
				impressionRef,
				metadata: payload,
			},
		});
	};
}

export function updateParticipantMetadata(contestRef, participantRef, metadata) {
	return async (dispatch) => {
		dispatch({
			type: contestConstants.UPDATE_PARTICIPANT_METADATA_PENDING,
			payload: {contestRef, participantInfo: {ref: participantRef, metadata}},
		});

		let err;
		const path = `/contest/${contestRef}/user/${participantRef}/metadata`;
		const payload = {metadata: JSON.stringify(metadata)};
		try {
			[err] = await _rePost(path, payload);
		} catch (ex) {
			dispatch({type: contestConstants.UPDATE_PARTICIPANT_METADATA_ERROR, error: ex});

			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_updateParticipantMetadata';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				contestConstants.UPDATE_PARTICIPANT_METADATA_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: contestConstants.UPDATE_PARTICIPANT_METADATA_SUCCESS,
			payload: {contestRef, participantInfo: {ref: participantRef, metadata}},
		});
	};
}

export function setActiveTheme(contestRef, selectedTheme) {
	return (dispatch) => {
		dispatch({
			type: contestConstants.UPDATE_ACTIVE_THEME,
			payload: {contestRef, selectedTheme},
		});
	};
}
