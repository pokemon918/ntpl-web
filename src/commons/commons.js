import {fetch as fetchPolyfill} from 'whatwg-fetch';
import formatDate from 'date-fns/format';
import {basePath} from './shared.js';
import {getRequestSignature} from 'ntbl_client/ntbl_api';
import {getFinalRating} from 'ntbl_client/ntbl_ratingAlgo';
import storage from 'redux-persist/lib/storage';
import crypto from 'crypto';
import appConfig from 'config/app';
import {appConstants, routeConstants} from 'const';
import {store} from 'store';
import dateFns from 'date-fns';
import get from 'lodash/get';
import Chiqq from './Chiqq.ts';

const REQUEST_RETRY_MAX_ATTEMPTS = 3;
const REQUEST_RETRY_DELAY = 1000;
const TRUNCATE_LENGTH = 35;

export function isLocalhost(host = window.location.hostname) {
	return /^(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.0\.\d+\.\d+|\[::1\]|bs-local.com)$/.test(
		host.split(':').shift()
	);
}

export const signPath = async (pathToSign, method, callback = null) => {
	// Get user specs from local storage
	var mem = JSON.parse(await storage.getItem('mem'));

	if (mem == null) {
		return basePath + pathToSign;
	}

	// Generate signature
	let signature = getRequestSignature(method, pathToSign, mem.userRef, mem.hpass);
	let signedPath = basePath + pathToSign + '?who=' + signature;

	return signedPath;
};

export function getLabel(option, stringsToRemove = []) {
	// Clean the label from possible key and list of stringsToRemove
	let label = option;

	stringsToRemove.forEach((str) => {
		label = label.replace(str, '');
	});

	// Check if the label is more than one word
	if (label.indexOf('_') !== -1) {
		label = label.split('_');
		label = label.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
		});
	} else {
		label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
	}

	return label;
}

export function getTotalRatingPoints(rawRatings) {
	return getFinalRating({
		type: 'nectar-1.2.0',
		scale: {
			min: 0,
			max: 1,
		},
		data: {
			balance: rawRatings.rating_balance_,
			length: rawRatings.rating_finish__,
			intensity: rawRatings.rating_intensity__,
			terroir: rawRatings.rating_terroir_,
			complexity: rawRatings.rating_complexity_,
			quality: rawRatings.rating_quality__,
			drinkability: rawRatings.rating_drinkability_,
		},
	});

	/*
	let ratings = JSON.parse(JSON.stringify(rawRatings));
	let sumOfScales = 0;
	let basePoints = ratingConstants.BASE_POINTS;

	console.log('calculating points', ratings);

	if (ratings == null || Object.keys(ratings).length <= 0) {
		return basePoints;
	}

	// Remove final_points from the RatingTotal computation
	if (Object.keys(ratings).includes('final_points')) {
		delete ratings['final_points'];
	}

	// Get all ratingItems
	Object.keys(ratings).forEach((key) => {
		//	Note: .toFixed converts the float val to string so it's needed to parse it twice;
		//	todo: parse the rating values before returning to client-side
		sumOfScales += ratings[key];

	});

	// Compute based on formula | Formula: The number displayed is then 50 + (50 * (sum of all scales)/number of scales )
	let total = Math.round(basePoints + 50 * (sumOfScales / Object.keys(ratings).length));
	return total;

	//*/
}

export function clearCache(history, route) {
	storage.removeItem('loggedinUser');
	storage.removeItem('userSpecs');
	storage.removeItem('wines');
	storage.removeItem('mem');
	storage.removeItem('teams');
	storage.removeItem('multiStepForm');
}

export function redirect(history, route) {
	history.push(route);
}

export function userCacheExists() {
	var loggedinUser = JSON.parse(localStorage.getItem('loggedinUser'));
	var mem = JSON.parse(localStorage.getItem('mem'));
	return loggedinUser !== undefined && loggedinUser !== null && mem !== undefined && mem !== null;
}

export function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

export function daysAgo(numOfDays) {
	let today = new Date();
	today.setDate(today.getDate() - numOfDays);
	return today;
}

export function areSameDates(date1, date2) {
	return (
		date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate()
	);
}

export function withinDateRange(date1, date2) {
	let today = new Date();
	let endDate = new Date(date2.getTime());
	endDate.setHours(0, 0, 0, 0); // set the beginning of endDate to midnight
	return date1.getTime() <= today.getTime() && date1.getTime() >= endDate.getTime();
}

export function isEmpty(item) {
	if (item === undefined || item === null) {
		return true;
	}
}

export function sortByName(arr) {
	if (
		arr === undefined ||
		arr === null ||
		Object.prototype.toString.call(arr) !== '[object Array]'
	) {
		return false;
	}

	arr.sort(function (a, b) {
		if (a['name'] && b['name']) {
			var nameA = a['name'].toUpperCase();
			var nameB = b['name'].toUpperCase();

			if (nameA < nameB) {
				return -1;
			}

			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		}

		return false;
	});
}

export function truncate(str) {
	if (!str) {
		return '';
	}

	if (str.length <= TRUNCATE_LENGTH - 3) {
		return str;
	}

	return str.slice(0, TRUNCATE_LENGTH) + '...';
}

export function setCoreApi(url) {
	if (appConfig.DEV_MODE) {
		store.dispatch({
			type: appConstants.SET_ADVANCED_OPTIONS,
			payload: {
				serverUrl: url,
			},
		});
	}
}

export function isUserUnauthorized(error) {
	const status = get(error, 'status') || get(error, 'response.status');
	const errorCode = get(error, 'response.data.error.code');

	const isUnauthorized = status === 401;
	const isBadCredentials = status === 400 && errorCode === 'invalid_credentials';

	return isUnauthorized || isBadCredentials;
}

export function handleError(error, dispatch = null) {
	let payload = {message: 'error_on_server'};

	if (error.response) {
		if (error.response.data && error.response.data.statusCode === 503) {
			window.location.href = routeConstants.MAINTENANCE;
		} else if (error.response.status === 412) {
			payload = {message: error.customError};
		}

		if (isUserUnauthorized(error)) {
			payload = {message: 'error_unauthorized', status: 401};
		} else if (error.response.status === 429) {
			payload = {title: 'error_headline_connection', message: 'error_too_many_requests'};
		} else if (error.response.data) {
			payload = error.response.data;
		}
	} else if (error.customError) {
		payload = {message: error.customError};
	} else {
		payload = {message: error.message};
	}

	if (dispatch) {
		dispatch({type: appConstants.APP_ERROR, payload: payload});
		dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: payload});
	}

	return payload;
}

const _delay = async (timeout) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), timeout);
	});
};

const _error = async (response, request) => {
	return response
		.json()
		.then((errorResponse) => {
			let message =
				errorResponse && errorResponse.message
					? errorResponse.message
					: `Status: ${response.status}, ${response.statusText}`;
			let error = {
				status: response.status,
				statusText: response.statusText,
				message: message,
				request,
			};
			if (errorResponse) {
				error['response'] = {};
				error.response['data'] = errorResponse;
			}
			return error;
		})
		.catch((error) => {
			error = {request};
			error['response'] = {};
			error.response['status'] = response.status;
			return error;
		});
};

export const _retryGet = async (path) => {
	let count = 0;
	let latestError = null;

	while (count++ < REQUEST_RETRY_MAX_ATTEMPTS) {
		if (count > 1) {
			await _delay(REQUEST_RETRY_DELAY);
		}
		try {
			const [err, response] = await _get(path);
			if (!err) {
				return [null, response];
			} else {
				latestError = err;
			}
		} catch (err) {
			latestError = err;
		}
	}

	// exceeded max retries, throw error
	return [latestError];
};

const _get = async (path) => {
	let options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	const request = {path, options};
	let response = await fetchPolyfill(path, options);
	if (!response.ok) {
		return [await _error(response, request)];
	}
	return [null, {data: await response.json()}];
};

export const _retryPost = async (path, data) => {
	let count = 0;
	let firstError = null;

	while (count++ < REQUEST_RETRY_MAX_ATTEMPTS) {
		if (count > 1) {
			await _delay(REQUEST_RETRY_DELAY);
		}
		try {
			const [err, response] = await _post(path, data);
			if (!err) {
				return [null, response];
			} else {
				firstError = firstError || err;
			}
		} catch (err) {
			firstError = firstError | err;
		}
	}

	// exceeded max retries, throw error
	return [firstError];
};

let q = new Chiqq({concurrency: 4, retryMax: 5, retryCooling: 1000});

export const _rePost = async (path, data, conf = {}) => {
	let err, res;
	const todo = async () => {
		conf.cb1 && setTimeout(conf.cb1(), 0);

		const url = await signPath(path, 'POST');

		return _post(url, data).then((x) => {
			conf.cb2 && conf.cb2();
			return x;
		});
	};

	try {
		[err, res] = await q.add(todo, conf);
	} catch (e) {
		return [e];
	}

	if (err) {
		return [err];
	}

	return [null, res];
};

export const _reGet = async (path, conf = {}) => {
	let err, res;
	const todo = async () => {
		conf.cb1 && setTimeout(conf.cb1(), 0);

		const url = await signPath(path, 'GET');

		return _get(url).then((x) => {
			conf.cb2 && conf.cb2();
			return x;
		});
	};

	try {
		[err, res] = await q.add(todo, conf);
	} catch (e) {
		return [e];
	}

	if (err) {
		return [err];
	}

	return [null, res];
};

const _post = async (path, data) => {
	let options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};

	/*if (!appConfig.DEV_MODE) {
		options.mode = 'no-cors';
	}*/

	const request = {path, options};
	let response = await fetchPolyfill(path, options);
	if (!response.ok) {
		return [await _error(response, request)];
	}
	return [null, {data: await response.json()}];
};

export const _upload = async (path, data) => {
	let options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		body: data,
	};

	const request = {path, options};

	let response = await fetchPolyfill(path, options);
	if (!response.ok) {
		return [await _error(response, request)];
	}
	return [null, {data: await response.json()}];
};

export const getFullDateAndTime = (date) => {
	return dateFns.format(date, 'YYYY-MM-DD HH:MM:SS');
};

export const getFormattedDate = (date) => {
	if (!date) {
		return null;
	}

	return formatDate(date, 'YYYY-MM-DD');
};

export function getScreenDimensions() {
	const {innerWidth, innerHeight} = window;
	return `${innerWidth}x${innerHeight}px`;
}

export function getScreenOrientation() {
	const {innerWidth, innerHeight} = window;
	return innerWidth > innerHeight ? 'landscape' : 'portrait';
}

export function isTouchScreen() {
	return (
		'ontouchstart' in document.documentElement ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

export function escapeHtml(text = '') {
	return text.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function isProductionSite() {
	return /noteable.co$/.test(window.location.hostname);
}

const STANDARD_EMAIL_REGEX = /^[a-z0-9._-]{0,64}@[a-z0-9._-]{0,64}\.[a-z]{2,32}$/i;

export function isEmailValid(email) {
	// regex source: https://emailregex.com
	return STANDARD_EMAIL_REGEX.test(email);
}

export const replaceEmail = (email) => {
	return email.replace(/[^a-z0-9.@_-]+/gi, '');
};

export function getLinkWithArguments(route, args = {}) {
	if (!route) {
		return routeConstants.HOME;
	}
	return route.replace(/\/:([^/]+)/gi, (match, argument) => {
		if (args[argument]) {
			return `/${args[argument]}`;
		}
		return match;
	});
}

export function reverseImmutable(array) {
	const clone = [...array];
	clone.reverse();
	return clone;
}

export function createEmailMessage(subject, message) {
	const link = document.createElement('a');
	link.href = `mailto:dev@noteable.co?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(message)}`;
	link.click();
}

export function getLocalState() {
	const datetime = new Date().toISOString();
	const payload = {
		datetime,
		url: window.location.href,
		localStorage: window.localStorage,
	};
	const json = JSON.stringify(payload, null, 2);
	return {datetime, json};
}

export function exportLocalState() {
	const {datetime, json} = getLocalState();
	const dataUri = `data:text/json,${json}`;
	const filename = `NTBL_LocalState_${datetime}.json`;
	const link = document.createElement('a');
	link.download = filename;
	link.href = dataUri;
	link.click();
}

const invalidUserNameChars = /[^\w ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ-]+/gi;
export function trimValidUserName(username = '') {
	return username.replace(invalidUserNameChars, '').replace(/ {2,}/g, ' ').replace(/^ +/g, '');
}

export function handleSingleDoubleClick(singleClickHandler, doubleClickHandler) {
	const DOUBLE_CLICK_TIMEOUT = 300;

	let clicks = 0;
	let delayed = null;

	function checkClickCount() {
		if (clicks === 1) {
			singleClickHandler();
		} else if (clicks >= 2) {
			doubleClickHandler();
		}
		clicks = 0;
		delayed = null;
	}

	return function onClick() {
		clicks++;

		if (!delayed) {
			delayed = setTimeout(checkClickCount, DOUBLE_CLICK_TIMEOUT);
		}
	};
}

export function removeExtraBlankLines(str = '') {
	if (typeof str !== 'string') {
		return '';
	}
	return str.replace('\r', '').replace(/\n{3,}/g, '\n\n');
}

export function jsonFromApi(metadata) {
	if (!metadata) {
		return null;
	}

	if (typeof metadata === 'string') {
		return JSON.parse(metadata);
	}

	return metadata;
}

const getCurrencyName = {
	app_currency_eur: 'EUR',
	app_currency_usd: 'USD',
	app_currency_dkk: 'DKK',
	app_currency_yen: 'YEN',
	app_currency_gbp: 'GBP',
	app_currency_bsv: 'BSV',
};

export const getCurrency = (price, currency) => {
	if (!price) {
		return '';
	}

	try {
		price = new Intl.NumberFormat('en-GB' /*navigator.languages*/, {
			maximumFractionDigits: 2,
		}).format(parseFloat(price));
	} catch (e) {}

	switch (getCurrencyName[currency] || currency) {
		case 'GBP':
			return `£${price}`;
		case 'DKK':
			return `${price} kr`;
		case 'EUR':
			return `€${price}`;
		case 'BSV':
			return `₿${price}`;
		default:
			try {
				return new Intl.NumberFormat('en-GB' /*navigator.languages*/, {
					style: 'currency',
					currency: getCurrencyName[currency] || currency,
					// minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(price);
			} catch (e) {}
			return `${price} ${(getCurrencyName[currency] || currency)?.toUpperCase()}`;
	}
};

export const scrollToActiveLabel = (e) => {
	const SCROLL_PIXEL = -20;
	const element = e.target;
	const yOffset = SCROLL_PIXEL;
	const bounding = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

	if (
		!(
			bounding.top >= 0 &&
			bounding.left >= 0 &&
			bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
			bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
		)
	) {
		element.scrollIntoView({
			block: 'center',
		});
	}
};
