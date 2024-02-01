import {Action} from 'redux';

import {contestConstants} from 'const';
import {ContestMedalStats} from './models';
import {RootState} from 'reducers';
import {isLoadingSelector} from 'reducers/requestStatusReducer';
import {createSelector} from 'reselect';

export interface ContestMedalState {
	allMedalStats: {[contestRef: string]: ContestMedalStats};
}

interface ContestMedalAction extends Action<string> {
	type: string;
	payload: {
		contestRef: string;
		data: ContestMedalStats;
	};
}

const defaultState: ContestMedalState = {
	allMedalStats: {},
};

export default function contestMedalReducer(state = defaultState, action: ContestMedalAction) {
	switch (action.type) {
		case contestConstants.FETCH_CONTEST_STATEMENT_SUMMARY_SUCCESS: {
			const {contestRef, data} = action.payload;

			const newState = {...state};
			newState.allMedalStats[contestRef] = data;

			return newState;
		}

		default:
			return state;
	}
}

interface ContestMedalSelectorProps {
	contestRef: string;
}

const getState = (state: RootState) => state.contests;

const getProps = (state: RootState, props: ContestMedalSelectorProps) => props;

export const contestMedalIsLoadingSelector = isLoadingSelector('FETCH_CONTEST_STATEMENT_SUMMARY');

export const makeContestMedalSelector = () =>
	createSelector(
		[getState, getProps],
		(state, props) => state.contestMedal.allMedalStats[props.contestRef] ?? []
	);
