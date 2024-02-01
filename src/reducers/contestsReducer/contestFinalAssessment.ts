import {Action} from 'redux';
import {createSelector} from 'reselect';
import {startCase} from 'lodash';

import {contestConstants} from 'const';
import {
	ContestTeamAssessment,
	ContestTeamStats,
	ContestTeamMemberAssessment,
	ContestTeamAdminAssessment,
	ContestTeamLeadAssessment,
} from './models';
import {lower} from './utils';
import {RootState} from 'reducers';
import {isLoadingSelector} from 'reducers/requestStatusReducer';

export interface ContestFinalAssessmentState {
	allStats: {
		[contestRef: string]: {
			[collectionRef: string]: {
				[teamRef: string]: ContestTeamAssessment;
			};
		};
	};
}

interface ContestFinalAssessmentAction extends Action<string> {
	payload: {
		contestRef: string;
		collectionRef: string;
		teamRef: string;
		impressionRef?: string;
		wineRef?: string;
		status: 'pending' | 'success' | 'error';
		error: Error;
		data: ContestTeamStats;
		metadata: {
			statement: string;
			extra_a: string;
			extra_b: string;
			extra_c: string;
			extra_d: string;
			extra_e: string;
		};
		field?: {
			metadata: {
				marked_statements: string[];
			};
		};
	};
}

const defaultState: ContestFinalAssessmentState = {
	allStats: {},
};

export default function contestFinalAsessmentReducer(
	state = defaultState,
	action: ContestFinalAssessmentAction
) {
	switch (action.type) {
		case contestConstants.FETCH_CONTENT_STATS_SUCCESS: {
			const {contestRef, collectionRef, teamRef, status, data, error} = action.payload;
			const newStats = {...state.allStats} || {};

			const teamStats: ContestTeamAssessment = {status, data, error, subjects: {}};
			newStats[contestRef] = newStats[contestRef] || {};
			newStats[contestRef][collectionRef] = newStats[contestRef][collectionRef] || {};
			newStats[contestRef][collectionRef][teamRef] = teamStats;

			if (data) {
				const teamSubjects: typeof teamStats.subjects = {};

				data.subjects.forEach((subject) => {
					const wineRef = subject.data.ref;
					const teamStatementInfo = subject.team_statement || {};
					const teamImpressions: {[creatorRef: string]: ContestTeamMemberAssessment} = {};

					subject.impressions.forEach((impression) => {
						const {medal = '', recommendation = ''} = impression.data.info || {};
						teamImpressions[impression.creator.ref] = {
							ref: impression.data.ref,
							medal: startCase(medal.replace('_', ' ')),
							recommendation: startCase(recommendation.replace('_', ' ')),
							tasting_note: impression.data.summary_personal,
							food_pairing: impression.data.food_pairing,
						};
					});

					const isAdminStats = teamRef === contestRef;
					if (isAdminStats) {
						teamSubjects[wineRef] = {
							admin_conclusion: teamStatementInfo.statement,
							by_the_glass: lower(teamStatementInfo.extra_a) === 'by the glass',
							food_match: lower(teamStatementInfo.extra_b) === 'food match',
							critics_choice: lower(teamStatementInfo.extra_c) === 'critics choice',
							pub_and_bar: lower(teamStatementInfo.extra_d) === 'pub & bar',
							wines_of_the_year: teamStatementInfo.extra_e,
						};
					} else {
						teamSubjects[wineRef] = {
							team_suggestion: teamStatementInfo.extra_a,
							team_conclusion: teamStatementInfo.statement,
							team_marked_statements:
								teamStatementInfo.metadata && teamStatementInfo.metadata.marked_statements
									? teamStatementInfo.metadata.marked_statements || []
									: [],
							impressions: teamImpressions,
						};
					}
				});

				newStats[contestRef][collectionRef][teamRef].subjects = teamSubjects;
			}

			return {
				...state,
				allStats: newStats,
			};
		}

		case contestConstants.UPDATE_TEAM_STATEMENT_PENDING:
		case contestConstants.UPDATE_TEAM_STATEMENT_SUCCESS: {
			const {contestRef, collectionRef, teamRef, impressionRef, metadata} = action.payload;
			const newStats = {...state.allStats} || {};

			// update admin conclusion if applicable
			if (contestRef === teamRef && impressionRef && metadata.statement) {
				const subjects = newStats[contestRef]?.[collectionRef]?.[teamRef]?.subjects;
				if (subjects) {
					const currentSubject = subjects[impressionRef] as ContestTeamAdminAssessment;
					if (currentSubject) {
						currentSubject.admin_conclusion = metadata.statement;
					}
				}

				return {...state, stats: newStats};
			}

			return state;
		}

		case contestConstants.UPDATE_ADMIN_CONTEST_STATEMENT_PENDING:
		case contestConstants.UPDATE_ADMIN_CONTEST_STATEMENT_SUCCESS: {
			const {contestRef, collectionRef, teamRef, wineRef, field} = action.payload;
			if (!wineRef || !field?.metadata?.marked_statements) {
				return state;
			}

			const newStats = {...state.allStats} || {};

			const subjects = newStats?.[contestRef]?.[collectionRef]?.[teamRef]?.subjects;
			const modifiedWine = subjects?.[wineRef] as ContestTeamLeadAssessment;
			if (!modifiedWine) {
				return state;
			}

			modifiedWine.team_marked_statements = field?.metadata?.marked_statements;
			newStats[contestRef][collectionRef][teamRef].subjects[wineRef] = modifiedWine;

			return {
				...state,
				allStats: newStats,
			};
		}

		default:
			return state;
	}
}
interface ContestFinalAssessmentSelectorProps {
	contestRef: string;
}

const getState = (state: RootState) => state.contests;

const getProps = (state: RootState, props: ContestFinalAssessmentSelectorProps) => props;

export const contestFinalAssessmentIsLoadingSelector = isLoadingSelector('FETCH_CONTENT_STATS');

export const makeContestFinalAsessmentSelector = () =>
	createSelector(
		[getState, getProps],
		(state, props) => state.contestFinalAssessment.allStats[props.contestRef]
	);
