import {Action} from 'redux';

import {contestConstants} from 'const';
import {RootState} from 'reducers';
import {ContestTeamStats} from './models';
import {createSelector} from 'reselect';
import {isLoadingSelector} from 'reducers/requestStatusReducer';

export interface ContestTeamLeadState {
	teamLeadDashboard: {
		[contestRef: string]: {
			[collectionRef: string]: {
				[teamRef: string]: ContestTeamStats;
			};
		};
	};
}

interface ContestTeamLeadAction extends Action<string> {
	payload: {
		contestRef: string;
		collectionRef: string;
		teamRef: string;
		wineRef?: string;
		data?: any;
		field?: {
			metadata: {
				marked_statements: string[];
			};
		};
	};
}

const defaultState: ContestTeamLeadState = {
	teamLeadDashboard: {},
};

export default function contestTeamLeadReducer(
	state = defaultState,
	action: ContestTeamLeadAction
) {
	switch (action.type) {
		case contestConstants.FETCH_CONTEST_TEAM_LEADER_SUCCESS: {
			const {contestRef, collectionRef, teamRef, data} = action.payload;

			const newDashboard = {...state.teamLeadDashboard};
			newDashboard[contestRef] = newDashboard[contestRef] || {};
			newDashboard[contestRef][collectionRef] = newDashboard[contestRef][collectionRef] || {};
			newDashboard[contestRef][collectionRef][teamRef] = data;

			return {
				...state,
				teamLeadDashboard: newDashboard,
			};
		}

		case contestConstants.UPDATE_CONTEST_STATEMENT_PENDING:
		case contestConstants.UPDATE_CONTEST_STATEMENT_SUCCESS: {
			const {contestRef, collectionRef, teamRef, wineRef, field} = action.payload;

			const newDashboard = {...state.teamLeadDashboard};
			const newSubjects = newDashboard[contestRef]?.[collectionRef]?.[teamRef]?.subjects;

			if (newSubjects) {
				newDashboard[contestRef][collectionRef][teamRef].subjects = newSubjects.map((subject) => {
					if (subject?.data?.ref === wineRef) {
						subject.team_statement = {
							...subject.team_statement,
							...field,
						};
					}
					return subject;
				});
			}

			return {
				...state,
				teamLeadDashboard: newDashboard,
			};
		}

		default:
			return state;
	}
}

interface ContestTeamLeadSelectorProps {
	contestRef: string;
	collectionRef: string;
	teamRef: string;
}

const getState = (state: RootState) => state.contests;

const getProps = (state: RootState, props: ContestTeamLeadSelectorProps) => props;

export const contestTeamLeadIsLoadingSelector = isLoadingSelector('FETCH_CONTEST_TEAM_LEADER');

export const makeContestTeamLeadSelector = () =>
	createSelector(
		[getState, getProps],
		(state, props) =>
			state.contestTeamLead.teamLeadDashboard[props.contestRef]?.[props.collectionRef]?.[
				props.teamRef
			]
	);
