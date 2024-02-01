/*  */import {feedbackConstants} from 'const';
import {_rePost, handleError} from 'commons/commons';

export function sendFeedback(feedback, callback) {
	return async (dispatch) => {
		let err, response;
		const path = '/feedback';
		[err, response] = await _rePost(path, feedback);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), err);
			return;
		}

		if (callback) {
			callback();
		}

		dispatch({
			type: feedbackConstants.SEND_FEEDBACK_FULFILLED,
			payload: response.data,
		});
	};
}

function errorDispatch(dispatch, payload, error) {
	dispatch({type: feedbackConstants.SEND_FEEDBACK_ERROR, payload: payload.message, error});
}
