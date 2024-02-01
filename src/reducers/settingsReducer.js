import {appConstants} from 'const';

let defaultData = {
	activeForm: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.SET_ACTIVE_FORM: {
			let data = Object.assign({}, state, {activeForm: action.payload});
			return data;
		}
		default:
			return state;
	}
}
