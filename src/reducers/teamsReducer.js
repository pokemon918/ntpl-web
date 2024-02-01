import {teamsConstants} from 'const';
import bugsnagClient from 'config/bugsnag';
import get from 'lodash/get';

const defaultData = {
	data: [],
	error: null,
	isSaving: false,
	status: null,
	myTeams: [],
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case teamsConstants.FETCH_TEAMS_PENDING: {
			let data = Object.assign({}, state, {isSaving: false});
			return data;
		}

		case teamsConstants.FETCH_TEAMS_FULFILLED: {
			const teams = action.payload.data;
			let data = Object.assign({}, state, {data: teams, status: null, error: null});
			return data;
		}

		case teamsConstants.FETCH_TEAMS_REJECTED:
			bugsnagClient.notify(new Error('Failed to fetch teams.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload, isSaving: false});
			return data;

		case teamsConstants.FETCH_MY_TEAMS_FULFILLED: {
			const teams = action.payload.data;
			let data = Object.assign({}, state, {myTeams: teams, status: null, error: null});
			return data;
		}

		case teamsConstants.FETCH_MY_TEAMS_REJECTED: {
			bugsnagClient.notify(new Error('Failed to fetch my teams.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload});
			return data;
		}

		case teamsConstants.CREATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}

		case `${teamsConstants.CREATE_SUCCESS}_COMMIT`: {
			let newlyCreatedTeam = action.payload.data;
			let newTeams = JSON.parse(JSON.stringify(state.data));
			let newMyTeams = JSON.parse(JSON.stringify(state.myTeams));

			if (!newTeams.find((team) => team.handle === newlyCreatedTeam.handle)) {
				newTeams.push(newlyCreatedTeam);
			}
			if (!newMyTeams.find((team) => team.handle === newlyCreatedTeam.handle)) {
				newMyTeams.push(newlyCreatedTeam);
			}
			let data = Object.assign({}, state, {
				data: newTeams,
				myTeams: newMyTeams,
				isSaving: false,
				status: 'success',
				createdTeamRef: action.payload.data.ref,
			});
			return data;
		}

		case teamsConstants.ADD_TEAM_IMAGE_SUCCESS: {
			const updatedTeamData = action.payload.data;
			const replaceAvatar = (team) => {
				if (team.ref === updatedTeamData.ref) {
					return {
						...team,
						avatar: updatedTeamData.avatar,
					};
				}
				return team;
			};

			const newTeams = state.data.map(replaceAvatar);
			const newMyTeams = state.myTeams.map(replaceAvatar);

			const data = Object.assign({}, state, {
				data: newTeams,
				myTeams: newMyTeams,
				status: null,
				error: null,
			});
			return data;
		}

		case teamsConstants.ADD_TEAM_IMAGE_REJECTED: {
			bugsnagClient.notify(new Error('Failed to add team image.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			let data = Object.assign({}, state, {error: action.payload});

			return data;
		}

		case teamsConstants.INVITE_TEAM_MEMBERS_REJECTED:
			bugsnagClient.notify(new Error('Failed to invite team member.'), {
				metadata: {
					frontendUrl: window.location.href,
					requestUrl: get(action.payload, 'request.path'),
				},
			});

			return Object.assign({}, state, {error: action.payload});

		case teamsConstants.INVITE_TEAM_MEMBERS_FULFILLED: {
			const teams = action.payload.data;
			let data = Object.assign({}, state, {myTeams: teams, status: null, error: null});

			return data;
		}

		case teamsConstants.CREATE_ERROR: {
			let data = Object.assign({}, state, {
				isSaving: false,
				status: 'error',
				error: action.payload.error,
			});
			return data;
		}

		default:
			return state;
	}
}
