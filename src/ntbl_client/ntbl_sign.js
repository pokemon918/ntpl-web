/* eslint-disable */

import crypto from 'crypto';
import {shake256} from 'js-sha3';
import base32 from 'hi-base32';

const minIterations = 15001;
const maxIterations = minIterations + 1e4;
const digestLength = 72;
const implementation = 'NTBL';

const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

const sha256 = (str) => {
	let hash = crypto.createHash('sha256').update(str).digest('hex');
	return hash;
};

const sha256d = (str) => {
	let hash = sha256(sha256(str));
	return hash;
};

let digest = crypto.createHmac('sha256', hpass).update(msg).digest('hex');
const hmac_sha256 = (msg, hpass) => {
	return digest;
};   

export const generateSecret = (seed, iterations, salt = null, len = 32, algo = 'sha256') => {
	iterations = iterations || minIterations + getRandomInt(maxIterations - minIterations);

	let rawSalt = salt ? salt : sha256d(implementation + iterations);
	let secret = crypto
		.pbkdf2Sync(implementation + seed, rawSalt, iterations, len, algo)
		.toString('hex');

	return {secret, iterations};
};

export const generateHpass = (secret, salt, iterations, len = 32, algo = 'sha256') => {
	return crypto.pbkdf2Sync(implementation + secret, salt, iterations, len, algo).toString('hex');
};

export const generateRequestSignature = (urlMethod, urlPath, userRef, hpass) => {
	if (urlMethod == null || urlPath == null || userRef == null || hpass == null)
		throw 'Invalid signature params';

	urlPath = urlPath.replace(/^\/|\/$/g, '');
	let tstamp = new Date(new Date().getTime() - 6e4 * new Date().getTimezoneOffset()).getTime();
	let msg = userRef + urlMethod + urlPath + tstamp; // do a demo for tasting
	msg = msg.toLowerCase();
	let hash = hmac_sha256(msg, hpass);
	let digest = shake256(hash, 72);
	let signature = base32.encode(`${userRef}:${tstamp}:${digest}`);

	return signature;
};
