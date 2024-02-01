import {Action} from 'redux';
import {createSelector} from 'reselect';

import {contestConstants} from 'const';
import {ContestProgress} from './models';
import {RootState} from 'reducers';

export interface ContestProgressState {
	allProgresses: {[teamRef: string]: ContestProgress};
}

interface ContestProgressAction extends Action<string> {
	payload: {
		contestRef: string;
		teamRef: string;
		data: ContestProgressDataItem[];
	};
}

type ContestProgressDataItem = ContestProgressActionData[];

interface ContestProgressActionData {
	theme: string;
	total: number;
	todo: number;
	done: number;
}

const defaultState: ContestProgressState = {
	allProgresses: {},
};

export default function contestProgressReducer(
	state = defaultState,
	action: ContestProgressAction
) {
	switch (action.type) {
		case contestConstants.FETCH_ADMIN_PROGRESS_SUCCESS: {
			const {teamRef, data} = action.payload;

			const newProgresses = {...state.allProgresses};
			newProgresses[teamRef] = newProgresses[teamRef] || {};

			const allThemes = data.flat();
			for (const themeInfo of allThemes) {
				const {theme, total, todo, done} = themeInfo;
				newProgresses[teamRef][theme] = {total, todo, done};
			}

			return {
				...state,
				allProgresses: newProgresses,
			};
		}

		default:
			return state;
	}
}

const getState = (state: RootState) => state.contests;

export const getContestProgressSelector = createSelector(
	[getState],
	(state) => state.contestProgress.allProgresses
);
