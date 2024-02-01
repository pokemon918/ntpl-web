import {appConstants} from 'const';

let defaultData = {
	data: [],
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.FETCH_NAVBAR_FULFILLED: {
			return {
				...state,
				data: action.payload.data,
			};
		}
		default:
			return state;
	}
}
