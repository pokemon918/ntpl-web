import get from 'lodash/get';

const normalizedState = {
	PENDING: 'loading',
	SUCCESS: 'success',
	FULFILLED: 'success',
	ERROR: 'error',
	REJECTED: 'error',
};

const defaultState = {};

export default function requestStatusReducer(state = defaultState, action) {
	const {type} = action;
	const match = /(.*)_(PENDING|SUCCESS|FULFILLED|ERROR|REJECTED)$/.exec(type);

	// ignore non async action types
	if (!match) {
		return state;
	}

	const [, requestName, requestState] = match;
	const currentState = normalizedState[requestState];

	return {
		...state,
		[requestName]: currentState,
	};
}

const getLoadingState = (state, action) => get(state.requestStatus, action);

export const createLoadingSelector = (action) => (state) => getLoadingState(state, action);

export const isLoadingSelector = (action) => (state) =>
	getLoadingState(state, action) === normalizedState.PENDING;
