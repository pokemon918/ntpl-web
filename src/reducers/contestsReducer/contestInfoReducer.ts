import {Action} from 'redux';
import {createSelector} from 'reselect';

import {contestConstants} from 'const';
import {RootState} from 'reducers';
import {isLoadingSelector} from 'reducers/requestStatusReducer';
import {ContestInfo, ContestParticipant} from './models';

export interface ContestInfoState {
	allContests: {[contestRef: string]: ContestInfo};
	// any new field must be defined as nullable for backwards compatibility
	selectedTheme?: {[contestRef: string]: string};
}

interface ContestInfoAction extends Action<string> {
	payload: {
		contestRef: string;
		contestInfo?: ContestInfo;
		selectedTheme?: string;
		participantInfo?: ContestParticipant;
	};
}

const defaultState: ContestInfoState = {
	allContests: {},
	selectedTheme: {},
};

export default function contestInfoReducer(state = defaultState, action: ContestInfoAction) {
	switch (action.type) {
		case contestConstants.FETCH_CONTEST_SUCCESS: {
			const {contestRef, contestInfo} = action.payload;
			if (!contestInfo) {
				return state;
			}

			const newState = {...state};
			newState.allContests[contestRef] = contestInfo;
			return newState;
		}
		case contestConstants.UPDATE_CONTEST_TEAM_PENDING:
		case contestConstants.UPDATE_CONTEST_TEAM_SUCCESS:
		case contestConstants.UPDATE_CONTEST_ROLE_PENDING:
		case contestConstants.UPDATE_CONTEST_ROLE_SUCCESS:
		case contestConstants.UPDATE_PARTICIPANT_METADATA_PENDING:
		case contestConstants.UPDATE_PARTICIPANT_METADATA_SUCCESS: {
			const {contestRef, participantInfo} = action.payload;
			if (!participantInfo) {
				return state;
			}

			const participants = state.allContests[contestRef].participants;
			const participantIndex = participants.findIndex((p) => p.ref === participantInfo.ref);
			if (participantIndex === -1) {
				return state;
			}

			const newContest = {...state.allContests[contestRef]};
			const newParticipantData = {...newContest.participants[participantIndex]};
			newParticipantData.division = participantInfo.division;
			newContest.participants[participantIndex] = newParticipantData;

			if (newParticipantData.division) {
				newContest.teams = newContest.teams.map((team) => {
					const members = newContest.participants.filter((p) => p.division === team.ref);
					const count = members.length;
					return {
						...team,
						members: count,
					};
				});
			}

			if (participantInfo.role) {
				newParticipantData.role = participantInfo.role;
			}

			if (participantInfo.metadata) {
				newParticipantData.metadata = {
					...newContest.participants[participantIndex].metadata,
					...participantInfo.metadata,
				};
			}

			const newState = {...state};
			newState.allContests[contestRef] = newContest;
			return newState;
		}

		case contestConstants.ADD_USER_CONTEST_PENDING:
		case contestConstants.ADD_USER_CONTEST_SUCCESS: {
			const {contestRef, participantInfo} = action.payload;
			if (!participantInfo) {
				return state;
			}

			const participants = state.allContests[contestRef].participants;

			const alreadyAdded = participants.find((p) => p.ref === participantInfo.ref);
			if (alreadyAdded) {
				return state;
			}

			const newState = {...state};
			newState.allContests[contestRef].participants = [...participants, participantInfo];
			return newState;
		}

		case contestConstants.UPDATE_ACTIVE_THEME:
			const {contestRef, selectedTheme} = action.payload;
			const newState = {...state};
			newState.selectedTheme = newState.selectedTheme || {};
			newState.selectedTheme[contestRef] = selectedTheme || '';
			return newState;
	}

	return state;
}

interface ContestInfoSelectorProps {
	contestRef: string;
}

const getState = (state: RootState) => state.contests;

const getProps = (state: RootState, props: ContestInfoSelectorProps) => props;

export const contestInfoIsLoadingSelector = isLoadingSelector('FETCH_CONTEST');

export const makeContestInfoSelector = () =>
	createSelector(
		[getState, getProps],
		(state, props) => state.contestInfo.allContests[props.contestRef]
	);

export const makeSelectedThemeSelector = () =>
	createSelector([getState, getProps], (state, props) => {
		const themes = state.contestInfo.selectedTheme ?? {};
		const contestTheme = themes[props.contestRef] ?? '';
		return contestTheme;
	});

export function contestThemesLoadingSelector(state: RootState, props: ContestInfoSelectorProps) {
	const themes = state.contests.contestInfo.allContests[props.contestRef]?.themes || [];
	const isLoading = !themes.length;
	return isLoading;
}

export function contestThemesSelector(state: RootState, props: ContestInfoSelectorProps) {
	const themes = state.contests.contestInfo.allContests[props.contestRef]?.themes || [];
	return themes.map((name) => ({name}));
}

export function teamNamesSelector(state: RootState, props: ContestInfoSelectorProps) {
	const teamNames: {[key: string]: string} = {};
	const teams = state.contests.contestInfo.allContests[props.contestRef]?.teams || [];
	teams.forEach((team) => {
		teamNames[team.ref] = team.name;
	});
	return teamNames;
}
