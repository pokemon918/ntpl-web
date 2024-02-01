export function getNormalizeSubscriptionUrls(action) {
	if (action.payload) {
		return action.payload.data.reduce((normalized, item) => ({...normalized, ...item}), {});
	}

	return null;
}
