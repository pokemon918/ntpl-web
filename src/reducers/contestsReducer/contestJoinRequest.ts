import {Action} from 'redux';

import {contestConstants} from 'const';
import {ContestParticipant} from './models';
import {RootState} from 'reducers';
import {isLoadingSelector} from 'reducers/requestStatusReducer';
import {createSelector} from 'reselect';

export interface ContestJoinRequestState {
	allRequests: {
		[contestRef: string]: ContestParticipant[];
	};
}

interface ContestJoinRequestAction extends Action<string> {
	type: string;
	payload: {
		contestRef: string;
		data: ContestParticipant[];
		participantInfo?: ContestParticipant;
	};
}

const defaultState: ContestJoinRequestState = {
	allRequests: {},
};

export default function contestJoinRequestReducer(
	state = defaultState,
	action: ContestJoinRequestAction
) {
	switch (action.type) {
		case contestConstants.FETCH_CONTEST_REQUEST_SUCCESS: {
			const {contestRef, data} = action.payload;

			const newRequests = {...state.allRequests};
			newRequests[contestRef] = data;

			return {
				...state,
				allRequests: newRequests,
			};
		}

		case contestConstants.ADD_USER_CONTEST_PENDING:
		case contestConstants.ADD_USER_CONTEST_SUCCESS:
		case contestConstants.REJECT_USER_CONTEST: {
			const {contestRef, participantInfo} = action.payload;

			const contestRequests = state.allRequests[contestRef];
			if (!contestRequests || !participantInfo) {
				return state;
			}

			const removedParticipant = contestRequests.filter(
				(joinRequest) => joinRequest.ref !== participantInfo.ref
			);

			const newState = {...state};
			newState.allRequests[contestRef] = removedParticipant;

			return newState;
		}

		default:
			return state;
	}
}

interface ContestJoinRequestSelectorProps {
	contestRef: string;
}

const getState = (state: RootState) => state.contests;

const getProps = (state: RootState, props: ContestJoinRequestSelectorProps) => props;

export const contestJoinRequestIsLoadingSelector = isLoadingSelector(
	'FETCH_CONTEST_STATEMENT_SUMMARY'
);

export const makeContestJoinRequestSelector = () =>
	createSelector(
		[getState, getProps],
		(state, props) => state.contestJoinRequest.allRequests[props.contestRef] ?? []
	);
