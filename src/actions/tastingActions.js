import {appConstants, tastingsConstants, userConstants, routeConstants} from 'const';
import {_rePost, handleError} from 'commons/commons';

export function createTasting(tastingData, successCallback) {
	return async (dispatch) => {
		dispatch({type: userConstants.CREATE_START});
		let err, response;
		const path = '/tasting';

		try {
			[err, response] = await _rePost(path, tastingData);
		} catch (err) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {
					request: {
						path,
						options: {method: 'POST'},
						data: tastingData,
						url: routeConstants.MY_TASTINGS,
					},
					status: 'Exception',
				},
			});
		}

		if (err) {
			err.customError = 'error_addTasting';

			errorDispatch(dispatch, handleError(err, dispatch), userConstants.CREATE_ERROR, err);

			return;
		}

		dispatch({type: userConstants.CREATE_FULFILLED, payload: response.data});
		successCallback();
	};
}

export function deleteTastings(tastingRef) {
	const payload = {
		wine_refs: Array.isArray(tastingRef) ? tastingRef : [tastingRef],
	};

	return async (dispatch) => {
		dispatch({type: tastingsConstants.DELETE_TASTING_PENDING});

		let err, response;
		const path = '/tasting/delete';
		try {
			[err, response] = await _rePost(path, payload);
		} catch (error) {
			return dispatch({
				type: appConstants.SERVER_ERROR,
				error: {request: {path, options: {method: 'GET'}}, status: 'Exception'},
			});
		}

		if (err) {
			err.customError = 'error_deleteTasting';

			errorDispatch(
				dispatch,
				handleError(err, dispatch),
				tastingsConstants.DELETE_TASTING_REJECTED,
				err
			);
			return;
		}

		dispatch({
			type: tastingsConstants.DELETE_TASTING_FULFILLED,
			payload: response.data,
		});
	};
}

function errorDispatch(dispatch, payload, type = '', error) {
	dispatch({type: type, payload: payload, error});
}
