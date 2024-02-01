import {feedbackConstants} from 'const';

const defaultData = {
	success: null,
	error: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case feedbackConstants.SEND_FEEDBACK_FULFILLED: {
			let data = Object.assign({}, state, {success: {message: action.payload}});
			return data;
		}

		case feedbackConstants.SEND_FEEDBACK_ERROR: {
			let data = Object.assign({}, state, {error: {message: action.payload}});
			return data;
		}

		default:
			return state;
	}
}
