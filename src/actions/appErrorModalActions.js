import {appConstants} from 'const';

export function closeModal() {
	return (dispatch) => {
		dispatch({
			type: appConstants.DISMISS_APP_ERROR_MODAL,
			payload: null,
		});
	};
}
