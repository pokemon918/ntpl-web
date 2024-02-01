eslint - disable;
/*  */
import * as sign from './ntbl_sign';

let mem = {
	hpass: '',
	userRef: '',
};

export const getAuthCreationPayload = (seed, info) => {
	const {secret, iterations} = sign.generateSecret(seed);

	let payload = {
		hpass: secret,
		iterations: iterations,
		...info,
	};

	return payload;
};

export const initiateLogin = (seed, userRef, salt, iterations) => {
	const {secret} = sign.generateSecret(seed, iterations);

	mem.userRef = userRef;

	mem.hpass = sign.generateHpass(secret, salt, iterations);

	// todo: verify that credentials are valid

	return true;
};

export const getRequestSignature = (
	urlMethod,
	urlPath,
	userRef = mem.userRef,
	hpass = mem.hpass
) => {
	return sign.generateRequestSignature(urlMethod, urlPath, userRef, hpass);
};

export const getHpass = () => {
	return mem.hpass;
};

export const exportBackup = () => {
	return JSON.stringify(mem);
};

export const importBackup = (data) => {
	let _mem = JSON.parse(data);
	if (!_mem.hpass || !_mem.userRef) {
		throw 'Error in imported data';
	}

	mem = _mem;
};
