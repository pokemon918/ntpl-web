import {winesConstants, appConstants} from 'const';
import winesReducer from './winesReducer';

describe('winesReducer', () => {
	it('Should define initial state', () => {
		const state = undefined;
		const action = {
			type: 'WHATEVER',
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		});
	});

	it('Should set loaded wines', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.FETCH_WINES_FULFILLED,
			payload: {
				data: [
					{name: 'Wine 1'},
					{name: 'Wine 2'},
					{name: 'Wine 3'},
					{name: 'Wine 4'},
					{name: 'Wine 5'},
					{name: 'Wine 6'},
					{name: 'Wine 7'},
					{name: 'Wine 8'},
					{name: 'Wine 9'},
					{name: 'Wine 10'},
					{name: 'Wine 11'},
					{name: 'Wine 12'},
					{name: 'Wine 13'},
					{name: 'Wine 14'},
					{name: 'Wine 15'},
				],
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [
				{id: 1, name: 'Wine 1'},
				{id: 2, name: 'Wine 2'},
				{id: 3, name: 'Wine 3'},
				{id: 4, name: 'Wine 4'},
				{id: 5, name: 'Wine 5'},
				{id: 6, name: 'Wine 6'},
				{id: 7, name: 'Wine 7'},
				{id: 8, name: 'Wine 8'},
				{id: 9, name: 'Wine 9'},
				{id: 10, name: 'Wine 10'},
				{id: 11, name: 'Wine 11'},
				{id: 12, name: 'Wine 12'},
				{id: 13, name: 'Wine 13'},
				{id: 14, name: 'Wine 14'},
				{id: 15, name: 'Wine 15'},
			],
			isLoading: false,
			error: null,
		});
	});

	it('Should set error message', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.FETCH_WINES_REJECTED,
			payload: {
				error: 'Something wrong happened!',
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: 'Something wrong happened!',
		});
	});

	it('Should clear error message', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: 'Something wrong happened!',
		};
		const action = {
			type: appConstants.RRS_DISMISS_SNACK,
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		});
	});

	it('Should set searched wines', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.SEARCH_WINES,
			payload: [
				{name: 'Wine 1'},
				{name: 'Wine 2'},
				{name: 'Wine 3'},
				{name: 'Wine 4'},
				{name: 'Wine 5'},
				{name: 'Wine 6'},
				{name: 'Wine 7'},
				{name: 'Wine 8'},
				{name: 'Wine 9'},
				{name: 'Wine 10'},
				{name: 'Wine 11'},
				{name: 'Wine 12'},
				{name: 'Wine 13'},
				{name: 'Wine 14'},
				{name: 'Wine 15'},
			],
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [
				{name: 'Wine 1'},
				{name: 'Wine 2'},
				{name: 'Wine 3'},
				{name: 'Wine 4'},
				{name: 'Wine 5'},
				{name: 'Wine 6'},
				{name: 'Wine 7'},
				{name: 'Wine 8'},
				{name: 'Wine 9'},
				{name: 'Wine 10'},
				{name: 'Wine 11'},
				{name: 'Wine 12'},
				{name: 'Wine 13'},
				{name: 'Wine 14'},
				{name: 'Wine 15'},
			],
			isLoading: false,
			error: null,
		});
	});

	it('Should set sorted wines and sort type', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [
				{name: 'Wine 1'},
				{name: 'Wine 2'},
				{name: 'Wine 3'},
				{name: 'Wine 4'},
				{name: 'Wine 5'},
				{name: 'Wine 6'},
				{name: 'Wine 7'},
				{name: 'Wine 8'},
				{name: 'Wine 9'},
				{name: 'Wine 10'},
				{name: 'Wine 11'},
				{name: 'Wine 12'},
				{name: 'Wine 13'},
				{name: 'Wine 14'},
				{name: 'Wine 15'},
			],
			error: null,
		};
		const action = {
			type: winesConstants.SORT_WINES,
			payload: {
				sortedWines: [
					{name: 'Wine 15'},
					{name: 'Wine 2'},
					{name: 'Wine 1'},
					{name: 'Wine 4'},
					{name: 'Wine 3'},
					{name: 'Wine 6'},
					{name: 'Wine 5'},
					{name: 'Wine 8'},
					{name: 'Wine 7'},
					{name: 'Wine 10'},
					{name: 'Wine 9'},
					{name: 'Wine 12'},
					{name: 'Wine 11'},
					{name: 'Wine 14'},
					{name: 'Wine 13'},
				],
				sortBy: 'rating',
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'rating',
			sortStatus: {},
			data: [
				{name: 'Wine 15'},
				{name: 'Wine 2'},
				{name: 'Wine 1'},
				{name: 'Wine 4'},
				{name: 'Wine 3'},
				{name: 'Wine 6'},
				{name: 'Wine 5'},
				{name: 'Wine 8'},
				{name: 'Wine 7'},
				{name: 'Wine 10'},
				{name: 'Wine 9'},
				{name: 'Wine 12'},
				{name: 'Wine 11'},
				{name: 'Wine 14'},
				{name: 'Wine 13'},
			],
			error: null,
		});
	});

	describe('Should set filtered wines', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [
				{name: 'Wine 1'},
				{name: 'Wine 2'},
				{name: 'Wine 3'},
				{name: 'Wine 4'},
				{name: 'Wine 5'},
				{name: 'Wine 6'},
				{name: 'Wine 7'},
				{name: 'Wine 8'},
				{name: 'Wine 9'},
				{name: 'Wine 10'},
				{name: 'Wine 11'},
				{name: 'Wine 12'},
				{name: 'Wine 13'},
				{name: 'Wine 14'},
				{name: 'Wine 15'},
			],
			error: null,
		};
		const action = {
			type: winesConstants.FILTER_WINES,
			payload: [
				{name: 'Wine 2'},
				{name: 'Wine 4'},
				{name: 'Wine 6'},
				{name: 'Wine 8'},
				{name: 'Wine 10'},
				{name: 'Wine 12'},
				{name: 'Wine 14'},
			],
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {},
			data: [
				{name: 'Wine 2'},
				{name: 'Wine 4'},
				{name: 'Wine 6'},
				{name: 'Wine 8'},
				{name: 'Wine 10'},
				{name: 'Wine 12'},
				{name: 'Wine 14'},
			],
			error: null,
		});
	});

	it('Should set collapsed flag', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.SAVE_COLLAPSE_STATE,
			payload: {
				collapse: {
					date_sort_c: true,
				},
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {
				collapse: {
					date_sort_c: true,
				},
			},
			data: [],
			isLoading: false,
			error: null,
		});
	});

	it('Should set another collapsed flag', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {
				collapse: {
					date_sort_c: true,
				},
			},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.SAVE_COLLAPSE_STATE,
			payload: {
				collapse: {
					date_sort_c: true,
					date_sort_d: true,
				},
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {
				collapse: {
					date_sort_c: true,
					date_sort_d: true,
				},
			},
			data: [],
			isLoading: false,
			error: null,
		});
	});

	it('Should unset collapsed flag', () => {
		const state = {
			sortBy: 'date',
			sortStatus: {
				collapse: {
					date_sort_c: true,
					date_sort_d: true,
				},
			},
			data: [],
			isLoading: false,
			error: null,
		};
		const action = {
			type: winesConstants.SAVE_COLLAPSE_STATE,
			payload: {
				collapse: {
					date_sort_c: true,
					date_sort_d: false,
				},
			},
		};
		const nextState = winesReducer(state, action);
		expect(nextState).toEqual({
			sortBy: 'date',
			sortStatus: {
				collapse: {
					date_sort_c: true,
					date_sort_d: false,
				},
			},
			data: [],
			isLoading: false,
			error: null,
		});
	});
});
