const defaultData = {
	names: [],
	wines: [],
	countries: [],
	producers: [],
	locations: [],
	autoSuggests: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case 'GET_AUTOSUGGEST_FULFILLED': {
			let data = Object.assign({}, state, action.payload);
			return data;
		}

		case 'GET_AUTOSUGGEST_PENDING': {
			return {
				...state,
			};
		}

		default:
			return state;
	}
}
