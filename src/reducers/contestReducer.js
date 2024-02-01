import {contestConstants} from 'const';
import {createLoadingSelector} from './requestStatusReducer';

const defaultData = {
	searchedContest: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case contestConstants.SEARCH_CONTEST_PENDING:
		case contestConstants.SEARCH_CONTEST_ERROR: {
			let data = Object.assign({}, state, {searchedContest: ''});

			return data;
		}

		case contestConstants.SEARCH_CONTEST_SUCCESS: {
			let data = Object.assign({}, state, {searchedContest: action.payload.data});

			return data;
		}

		default:
			return state;
	}
}

export const contestLoadingStateSelector = createLoadingSelector('FETCH_CONTEST');
export const contestLoadingStatementSelector = createLoadingSelector('UPDATE_CONTEST_STATEMENT');
export const contestResultsLoadingSelector = createLoadingSelector(
	'FETCH_CONTEST_STATEMENT_SUMMARY'
);
export const contestTeamLeaderLoadingSelector = createLoadingSelector('FETCH_CONTEST_TEAM_LEADER');
