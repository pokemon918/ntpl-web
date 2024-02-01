import {appConstants} from 'const';

export function setActiveForm(activeForm) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_ACTIVE_FORM,
			payload: activeForm,
		});
	};
}
