import alasql from 'alasql';
import _ from 'lodash';
import locNames from 'assets/json/locations.json';
import jsonh from 'jsonh';
import countryNames from 'assets/json/countries.json';

import {_retryGet, handleError} from 'commons/commons';

const publicPath =
	typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : '';

let nameData = false;
let producerData = false;
let _getProducersInfo = false;
let _getWinesInfo = false;

/**
 * startsWith is not supported in IE so custom built function to check starting text.
 *
 * @param {string} str
 * @param {string} keyword
 * @returns {boolean}
 */
const _startsWith = (str, keyword) => {
	const keywordLength = keyword.length;

	return str.substring(0, keywordLength) === keyword;
};

/**
 * Returns list of auto suggested coutries.
 *
 * @param {object} value
 * @param {object} info
 * @param {*} dispatch
 */
let suggestCountries = async (value, info, dispatch) => {
	let names = [];

	let findProducers = () => {
		let autoSuggests = info.autoSuggests ? _.cloneDeep(info.autoSuggests) : {};
		autoSuggests['tasting_producer'] = [];

		let countries = info.countries.length
			? info.countries
			: _.flattenDeep(Object.values(countryNames.countries));

		const autoSuggestedCountries = getCountryAutoSuggest(countries, Object.values(value)[0]);

		let countryIds = getCountryIds(autoSuggestedCountries);
		const {producers = []} = getProducersInfo(countryIds);

		autoSuggests['tasting_country'] = autoSuggestedCountries;

		dispatch({
			type: 'GET_AUTOSUGGEST_FULFILLED',
			payload: {autoSuggests, names, producers, countries},
		});
	};

	findProducers();
};

/**
 * Returns list of auto suggested producers.
 *
 * @param {object} value
 * @param {object} info
 * @param {*} dispatch
 */
let suggestProducers = async (input, info, dispatch) => {
	const locations = [];

	let autoSuggests = info.autoSuggests ? _.cloneDeep(info.autoSuggests) : {};
	if (info.autoSuggests) {
		autoSuggests['tasting_name'] = [];
		let countryIds = getCountryIds(info.autoSuggests['tasting_country']);

		const {producers = []} = getProducersInfo(countryIds);

		let updatedProducers = producers.filter((producer) => {
			const producerName = producer.name.toLowerCase();
			const keyword = input['tasting_producer'].toLowerCase();

			if (_startsWith(producerName, keyword)) {
				return {
					producerIds: producer.id,
					producerNames: producer.name,
				};
			}

			return null;
		});

		updatedProducers = updatedProducers.filter((producer, index) => index < 30);
		const producerIds = updatedProducers.map((producer) => producer.id);
		const producerNames = updatedProducers.map((producer) => producer.name);

		updatedProducers.forEach((producers) => {
			producers.locations.forEach((location) => {
				if (location.parent_id === parseInt(countryIds[0], 10)) {
					locations.push(location);
				}
			});
		});

		let findWines = function () {
			const {names = []} = getWineInfo(producerIds);

			autoSuggests['tasting_producer'] = producerNames;
			autoSuggests['tasting_region'] = locations.map((loc) => loc.name);
			autoSuggests['tasting_name'] = names.map((wine) => wine.name);

			dispatch({
				type: 'GET_AUTOSUGGEST_FULFILLED',
				payload: {autoSuggests, names, locations},
			});
		};

		findWines();
	} else {
		dispatch({
			type: 'GET_AUTOSUGGEST_FULFILLED',
			payload: null,
		});
	}
};

let suggestWines = async (input, info, dispatch) => {
	let autoSuggests = info.autoSuggests ? _.cloneDeep(info.autoSuggests) : {};

	const wines = info.names.filter((wine) => {
		const wineName = wine.name.toLowerCase();
		const keyword = input['tasting_name'].toLowerCase();

		if (_startsWith(wineName, keyword)) {
			return wine;
		}

		return null;
	});

	if (!wines[0]) {
		autoSuggests['tasting_name'] = [];

		return dispatch({
			type: 'GET_AUTOSUGGEST_FULFILLED',
			payload: {autoSuggests},
		});
	}

	const names = wines.map((wine) => wine.name);

	let findRegion = function () {
		autoSuggests['tasting_name'] = !!names.length ? names : [];

		dispatch({
			type: 'GET_AUTOSUGGEST_FULFILLED',
			payload: {autoSuggests},
		});
	};

	findRegion();
};

let suggestRegions = async (input, info, dispatch) => {
	let autoSuggests = info.autoSuggests ? _.cloneDeep(info.autoSuggests) : {};

	autoSuggests['tasting_region'] = [];
	const locations = info.locations
		.filter((location) => {
			const locationName = location.name.toLowerCase();
			const keyword = input['tasting_region'].toLowerCase();

			return _startsWith(locationName, keyword);
		})
		.map((location) => location.name);

	let findRegion = function () {
		autoSuggests['tasting_region'] = locations;

		dispatch({
			type: 'GET_AUTOSUGGEST_FULFILLED',
			payload: {autoSuggests},
		});
	};
	findRegion();
};

export function getAutoSuggestPendingStatus() {
	return (dispatch) => {
		dispatch({
			type: 'GET_AUTOSUGGEST_PENDING',
		});
	};
}

export function getAutoSuggest(input, info = {}) {
	let key = Object.keys(input)[0];

	return async (dispatch) => {
		if (!producerData) {
			let err, response;
			[err, response] = await _retryGet(`${publicPath}/json/autosuggest/producers.json`);

			if (err) {
				errorDispatch(dispatch, handleError(err, dispatch));
				return;
			}

			producerData = response.data;
			alasql('CREATE TABLE IF NOT EXISTS producers (id, name, countries, locations)');
			alasql('CREATE INDEX id ON producers(id)');
			alasql('CREATE INDEX name ON producers(name)');
			alasql.tables.producers.data = producerData;
		}

		if (!nameData) {
			let err, response;
			[err, response] = await _retryGet(`${publicPath}/jsonh/autosuggest/names.json`);

			if (err) {
				errorDispatch(dispatch, handleError(err, dispatch));
				return;
			}

			nameData = jsonh.unpack(response.data);
			alasql('CREATE TABLE IF NOT EXISTS names (name, producers)');
			alasql('CREATE INDEX name ON names(name)');
			alasql.tables.names.data = nameData;
		}

		switch (key) {
			case 'tasting_country':
				await suggestCountries(input, info, dispatch);
				break;
			case 'tasting_producer':
				await suggestProducers(input, info, dispatch);
				break;
			case 'tasting_name':
				await suggestWines(input, info, dispatch);
				break;
			case 'tasting_region':
				await suggestRegions(input, info, dispatch);
				break;
			default:
				dispatch({type: 'GET_AUTOSUGGEST_FULFILLED', payload: null});
		}
	};
}

function getProducersInfo(countryIds) {
	let producers = [];

	if (!_.isEmpty(countryIds)) {
		if (!_getProducersInfo) _getProducersInfo = alasql.compile(`SELECT * FROM producers`);

		for (const id of countryIds) {
			_getProducersInfo().forEach((producer) => {
				if (producer.countries.includes(parseInt(id, 10))) {
					producers.push(producer);
				}
			});
		}
	}

	return {
		producers,
	};
}

function getWineInfo(producerIds) {
	let names = [];
	let wineAutoSuggest = [];

	if (!_.isEmpty(producerIds)) {
		if (!_getWinesInfo) _getWinesInfo = alasql.compile(`SELECT * FROM names`);

		for (const id of producerIds) {
			_getWinesInfo().forEach((wine) => {
				if (wine.producers.includes(parseInt(id, 10))) {
					wineAutoSuggest.push(wine.name);
					names.push(wine);
				}
			});
		}
	}

	return {
		names,
		wineAutoSuggest,
	};
}

function getCountryIds(countries) {
	let locations = _.flattenDeep(Object.values(locNames));
	let locationsKeys = _.flattenDeep(Object.keys(locNames));
	let countryIds = [];

	locations.forEach((location, index) => {
		if (countries) {
			countries.forEach((country) => {
				if (country.toLowerCase() === location.toLowerCase()) {
					countryIds.push(locationsKeys[index]);
				}
			});
		}
	});

	return countryIds;
}

function getCountryAutoSuggest(countries, keyword) {
	let countryAutoSuggest = [];
	if (!_.isEmpty(keyword) || !_.isEmpty(countries)) {
		for (const country of countries) {
			const _countryLowerCase = country.name.toLowerCase();
			const _keywordLowerCase = keyword.toLowerCase();
			if (_startsWith(_countryLowerCase, _keywordLowerCase)) {
				countryAutoSuggest.push(country.name);
			}
		}
	}
	return countryAutoSuggest;
}

function errorDispatch(dispatch, payload) {
	dispatch({type: 'GET_AUTOSUGGEST_ERROR', payload: payload});
}
