import {commentsConstants} from 'const';

const defaultData = {
	autoNote: '',
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case commentsConstants.GET_AUTONOTE_FULFILLED: {
			let data = Object.assign({}, state, {autoNote: action.payload.message});
			return data;
		}

		default:
			return state;
	}
}
