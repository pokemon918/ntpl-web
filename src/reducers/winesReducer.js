import {winesConstants, appConstants, multiStepFormConstants, tastingsConstants} from 'const';

const defaultData = {
	isLoading: false,
	sortBy: 'date',
	sortStatus: {},
	data: [],
	error: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			return {...state, isLoading: false, error: null};
		}

		case winesConstants.FETCH_WINES_PENDING:
		case multiStepFormConstants.MULTI_FORM_SUBMIT_START: {
			return {...state, isLoading: true};
		}

		case appConstants.SERVER_ERROR:
			return {...state, isLoading: false};

		case winesConstants.FETCH_WINES_FULFILLED: {
			let newData = JSON.parse(JSON.stringify(state));
			let wines = action.payload.data;

			// Add temp ids
			wines = wines.map((wine, index) => {
				wine.id = index + 1;
				return wine;
			});

			let newSortStatus = newData.sortStatus;
			let newSortBy = newData.sortBy;

			return Object.assign({}, newData, {
				data: wines,
				isLoading: false,
				sortStatus: newSortStatus,
				sortBy: newSortBy,
				error: null,
			});
		}

		case tastingsConstants.DELETE_TASTING_FULFILLED:
			return {
				...state,
				data: state.data.filter((wine) => !action.payload.data.tasting_refs.includes(wine.ref)),
			};

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`: {
			return {
				...state,
				isLoading: false,
				data: [action.payload.data, ...state.data],
			};
		}

		case winesConstants.FETCH_WINES_REJECTED:
			let date = Object.assign({}, state, {
				error: action.payload.error,
				isLoading: false,
				data: [],
			});
			return date;

		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}

		case winesConstants.SEARCH_WINES: {
			let newWines = action.payload;
			return Object.assign({}, state, {data: newWines});
		}

		case winesConstants.SORT_WINES: {
			let sortedWines = action.payload.sortedWines;
			let newSortBy = action.payload.sortBy;
			return Object.assign({}, state, {data: sortedWines, sortBy: newSortBy});
		}

		case winesConstants.FILTER_WINES: {
			let newWines = action.payload;
			return Object.assign({}, state, {data: newWines});
		}

		case winesConstants.SAVE_COLLAPSE_STATE: {
			return Object.assign({}, state, {sortStatus: action.payload});
		}

		default:
			return state;
	}
}
