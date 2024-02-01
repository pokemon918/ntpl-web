import {_rePost} from 'commons/commons';
import {commentsConstants} from 'const';
import bugsnagClient from 'config/bugsnag';

export function getAutoNote(notes, commentCallBack, commentKey) {
	const payload = {
		notes,
		lang: 'en',
	};

	return async (dispatch) => {
		try {
			let err, response;

			[err, response] = await _rePost('/autonote', payload);

			if (err) {
				bugsnagClient.notify(new Error('Unable to fetch auto notes!'), {
					metadata: {error: err},
				});

				throw err;
			}

			commentCallBack(response.data.message);
			dispatch({
				type: commentsConstants.GET_AUTONOTE_FULFILLED,
				payload: response.data,
			});
		} catch (err) {
			bugsnagClient.notify(new Error('Unable to fetch auto notes!'), {
				metadata: {error: err},
			});

			throw err;
		}
	};
}
