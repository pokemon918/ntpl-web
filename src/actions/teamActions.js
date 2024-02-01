import storage from 'redux-persist/lib/storage';
import dateFns from 'date-fns';

import {_rePost, _upload, signPath} from 'commons/commons';
import {_reGet, handleError, escapeHtml} from 'commons/commons';
import {appConstants, teamsConstants} from 'const';

export function fetchTeams(history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.FETCH_TEAMS_PENDING});

		let err, response;
		const path = '/teams';

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}, url: 'my-teams'},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_fetchTeam';
			errorDispatch(dispatch, handleError(err, dispatch), teamsConstants.FETCH_TEAMS_REJECTED, err);
			return;
		}

		let teamsData = response.data;
		storage.setItem('teams', JSON.stringify(teamsData));
		dispatch({type: teamsConstants.FETCH_TEAMS_FULFILLED, payload: {data: teamsData}});
	};
}

export function fetchMyTeams(history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.FETCH_MY_TEAMS_PENDING});

		let err, response;
		const path = '/my-teams';

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}, url: 'my-teams'},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_myTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.FETCH_MY_TEAMS_REJECTED,
				err
			);
			return;
		}

		let teamsData = response.data;
		storage.setItem('myTeams', JSON.stringify(teamsData));
		dispatch({type: teamsConstants.FETCH_MY_TEAMS_FULFILLED, payload: {data: teamsData}});
	};
}

export function inviteMembers(ref, payload, history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.INVITE_TEAM_MEMBERS_PENDING});

		let err, response;
		const path = `/team/${ref}/invite`;

		try {
			[err, response] = await _rePost(path, payload);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'POST'}, url: `team/${ref}/invite`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_invitingTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.INVITE_TEAM_MEMBERS_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.INVITE_TEAM_MEMBERS_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function addTeam(teamData, addTeamCallback = false, history) {
	return async (dispatch) => {
		for (let key in teamData) {
			if (key !== 'visibility') {
				teamData[key] = escapeHtml(teamData[key]);
			}
		}
		dispatch({type: teamsConstants.CREATE_PENDING});

		const path = '/team';

		try {
			await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {
						path,
						options: {method: 'POST'},
						data: teamData,
						url: 'my-teams',
					},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (addTeamCallback) {
			addTeamCallback();
		}

		let teams = JSON.parse(await storage.getItem('teams'));

		// Validate for duplicate handler.
		const isValid = validationCheck((teams = []), teamData, dispatch);

		if (isValid) {
			const teamDataWithInfo = Object.assign({}, teamData, {
				userRelations: ['creator', 'owner', 'admin'],
				created_at: dateFns.format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
				updated_at: dateFns.format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
			});
			teams = [...teams, teamDataWithInfo];

			storage.setItem('teams', JSON.stringify(teams));

			const signedPath = await signPath(path, 'POST');

			dispatch({
				type: teamsConstants.CREATE_SUCCESS,
				payload: {data: teamDataWithInfo},
				meta: {
					offline: {
						// the network action to execute:
						effect: {url: signedPath, method: 'POST', json: {...teamData}},
						// action to dispatch when effect succeeds:
						commit: {type: `${teamsConstants.CREATE_SUCCESS}_COMMIT`},
						// action to dispatch if network action fails permanently:
						rollback: {
							type: appConstants.OPEN_APP_ERROR_MODAL,
							error: {
								request: {path: signedPath, options: {method: 'POST', body: teamData}},
							},
						},
					},
				},
			});
		}
	};
}

export function addTeamImage(ref, data) {
	return async (dispatch) => {
		const signedPath = await signPath(`/team/${ref}`, 'POST');
		let err, response;
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
			err.customError = 'error_addTeamImage';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.ADD_TEAM_IMAGE_REJECTED,
				err
			);
			return;
		}

		const myTeamData = response.data;
		dispatch({type: teamsConstants.ADD_TEAM_IMAGE_SUCCESS, payload: myTeamData});
	};
}

export function updateTeam(teamRef, teamCurrentData, changedData) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.UPDATE_PENDING});

		const signedPath = await signPath(`/team/${teamRef}`, 'POST');

		const teamUpdatedData = {...teamCurrentData};
		if (changedData.handle) teamUpdatedData.handle = escapeHtml(changedData.handle);
		if (changedData.description) teamUpdatedData.description = escapeHtml(changedData.description);
		if (changedData.relation) teamUpdatedData.userRelations = changedData.relation;

		dispatch({
			type: teamsConstants.UPDATE_SUCCESS,
			payload: teamUpdatedData,
			meta: {
				offline: {
					// the network action to execute:
					effect: {url: signedPath, method: 'POST', json: changedData},
					// action to dispatch when effect succeeds:
					commit: {type: `${teamsConstants.UPDATE_SUCCESS}_COMMIT`},
					// action to dispatch if network action fails permanently:
					rollback: {
						type: appConstants.OPEN_APP_ERROR_MODAL,
						error: {
							request: {path: signedPath, options: {method: 'POST', body: changedData}},
						},
					},
				},
			},
		});
	};
}

export function updateSelectedTeam(teamRef, payload) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.UPDATE_SELECTED_TEAM_PENDING});

		let err, response;
		const path = `/team/${teamRef}`;

		try {
			[err, response] = await _rePost(path, payload);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
			throw err;
		}

		if (err) {
			err.customError = 'error_updateTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.UPDATE_SELECTED_TEAM_ERROR,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.UPDATE_SELECTED_TEAM_SUCCESS,
			payload: {data: response.data},
		});
	};
}

export function fetchSelectedTeam(teamRef, teams = [], history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.FETCH_SELECTED_TEAM_PENDING});

		let err, response;
		const path = `/team/${teamRef}`;

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}, url: `/team/${teamRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_selectTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.FETCH_SELECTED_TEAM_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.FETCH_SELECTED_TEAM_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function joinToTeam(teamRef, history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.JOIN_TO_TEAM_PENDING});

		let err, response;
		const path = `/team/${teamRef}/join`;

		try {
			[err, response] = await _rePost(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'Post'}, url: `/team/${teamRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_joinTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.JOIN_TO_TEAM_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.JOIN_TO_TEAM_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function getListRequestsJoining(teamRef, history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.GET_LIST_REQUESTS_JOINING_PENDING});

		let err, response;
		const path = `/team/${teamRef}/join/pending`;

		try {
			[err, response] = await _reGet(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'GET'}, url: `/team/${teamRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_joinRequestTeam';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.GET_LIST_REQUESTS_JOINING_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.GET_LIST_REQUESTS_JOINING_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function acceptRequestToJoin(teamRef, actionRef, history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.ACCEPT_REQUEST_TO_JOIN_PENDING});

		let err, response;
		const path = `/team/${teamRef}/accept/${actionRef}`;

		try {
			[err, response] = await _rePost(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'Post'}, url: `/team/${teamRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_acceptRequest';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.ACCEPT_REQUEST_TO_JOIN_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.ACCEPT_REQUEST_TO_JOIN_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function declineRequestToJoin(teamRef, actionRef, history) {
	return async (dispatch) => {
		dispatch({type: teamsConstants.DECLINE_REQUEST_TO_JOIN_PENDING});

		let err, response;
		const path = `/team/${teamRef}/decline/${actionRef}`;

		try {
			[err, response] = await _rePost(path);
		} catch (err) {
			dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {path, options: {method: 'Post'}, url: `/team/${teamRef}`},
					status: 'Exception',
				},
			});

			throw err;
		}

		if (err) {
			err.customError = 'error_declineRequest';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				teamsConstants.DECLINE_REQUEST_TO_JOIN_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: teamsConstants.DECLINE_REQUEST_TO_JOIN_FULFILLED,
			payload: {data: response.data},
		});
	};
}

export function searchTeams(keyword, teams, online, history) {
	return async (dispatch) => {
		if (keyword && keyword.trim() !== '') {
			dispatch({type: teamsConstants.SEARCH_TEAMS_PENDING, payload: {}});

			// Find team from store in offline mode.
			if (!online) {
				const payload = teams.filter((team) => team.name.includes(keyword));

				dispatch({type: teamsConstants.SEARCH_TEAMS_FULFILLED, payload: payload});

				return;
			}

			let err, response;
			const path = `/teams/find/${keyword}`;
			try {
				[err, response] = await _reGet(path);
			} catch (err) {
				dispatch({
					type: appConstants.SERVER_ERROR,
					error: {
						request: {
							path,
							options: {method: 'GET'},
							url: `/find-teams/${keyword}`,
						},
						status: 'Exception',
					},
				});

				throw err;
			}

			if (err) {
				err.customError = 'error_searchTeam';

				errorDispatch(
					dispatch,
					handleError(err, dispatch),
					teamsConstants.SEARCH_TEAMS_REJECTED,
					err
				);
				return;
			}

			dispatch({type: teamsConstants.SEARCH_TEAMS_FULFILLED, payload: response.data});
		}
	};
}

export function clearSelectedTeam() {
	return (dispatch) => {
		dispatch({type: teamsConstants.CLEAR_SELECTED_TEAM});
	};
}

function errorDispatch(dispatch, payload, type = '', error) {
	dispatch({type: type, payload: {error: payload}, error});
}

function validationCheck(teams, teamData, dispatch) {
	const duplicateHandleLength = teams.find((team) => team.handle === teamData.handle);

	if (duplicateHandleLength) {
		dispatch({
			type: appConstants.OPEN_APP_ERROR_MODAL,
			payload: {message: 'team_error_handle_exist'},
		});

		dispatch({
			type: teamsConstants.CREATE_ERROR,
			payload: {message: 'team_error_handle_exist'},
		});

		return false;
	}

	return true;
}
