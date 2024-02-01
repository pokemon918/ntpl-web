export function getErrorTitle(action) {
	if (action.payload) return action.payload.title;
	return null;
}

export function getErrorMessage(action) {
	if (action.payload) {
		if (action.payload.status === 401) return 'error_unauthorized';
		if (
			action.payload.error &&
			action.payload.error.message &&
			action.payload.error.message === 'error_invalid_credentials'
		)
			return 'error_unauthorized';
		if (action.payload.message) return action.payload.message;
		if (action.payload.response) return action.payload.response.message;
		if (action.payload.error) return action.payload.error.message;
	}
	return null;
}

export function getErrorData(action) {
	if (action.payload) return action.payload.additionalData;
	return null;
}
