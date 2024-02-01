// converts a redux export to the format of NTBL states
// it's not 100% because it won't contain the actual `mem` of the former redux export
// but it may help on investigating old redux exports that we already have on trello!

// to use it, paste this function in the browser console and call the
// function convertFromRedux with the raw content of your redux export file

function convertFromRedux(reduxExportedJson) {
	// gets the frontend url from the current api server url
	const frontendUrls = {
		'http://localhost:8000': 'http://localhost:3000/',
		'https://v1.ntbl-api.eu': 'https://noteable.co/sign-in',
		'https://test2-api.ntbl.link': 'http://test.ntbl.link/sign-in',
		'https://dev2-api.ntbl.link': 'http://dev.ntbl.link/',
	};

	function exportLocalState(url, localStorageValue) {
		const datetime = new Date().toISOString();
		const payloa/*  */d = {
			datetime,
			localStorage: localStorageValue,
			url,
		};
		const json = JSON.stringify(payload, null, 2);
		const dataUri = `data:text/json,${json}`;
		const filename = `NTBL_LocalState_${datetime}.json`;
		const link = document.createElement('a');
		link.download = filename;
		link.href = dataUri;
		link.click();
	}

	function convertReduxToNtblState(exported) {
		const actions = JSON.parse(exported.payload);
		const rehydrate = actions.find((action) => action.type === 'persist/REHYDRATE');
		const {app, ...root} = rehydrate.payload;
		const wines = root.wines.data;
		const buildVersion = '__COMMIT__';
		const mem = localStorage.getItem('mem');

		const apiUrl = app.advancedOptions
			? app.advancedOptions.serverUrl
			: 'https://test2-api.ntbl.link';
		const url = frontendUrls[apiUrl];

		const localStorageValue = {
			wines,
			buildVersion,
			mem,
			'persist:root': root,
			'persist:app': app,
		};

		exportLocalState(url, localStorageValue);
	}

	convertReduxToNtblState(reduxExportedJson);
}
