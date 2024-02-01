class WebWorkerEngineAdapter {
	onSearchResponse = null;

	constructor(onSearchReady, onSearchError, onSearchResponse) {
		this.onSearchReady = onSearchReady;
		this.onSearchError = onSearchError;
		this.onSearchResponse = onSearchResponse;
		this.processResponse = this.processResponse.bind(this);
		this.worker = new Worker('/autosuggest/worker.js');
		this.worker.addEventListener('message', this.processResponse);
	}

	close() {
		this.worker.removeEventListener('message', this.processResponse);
	}

	processResponse(event) {
		const {type, payload} = event.data;
		const responseTypes = {
			ready: this.readyResponse.bind(this),
			error: this.errorResponse.bind(this),
			search: this.searchResponse.bind(this),
		};
		if (!type || !responseTypes[type]) return;
		responseTypes[type](payload);
	}

	readyResponse() {
		this.onSearchReady();
	}

	errorResponse(errors) {
		this.onSearchError(errors);
	}

	search(q) {
		const start = new Date();
		this.worker.postMessage({
			type: 'search',
			payload: {time: start, q},
		});
	}

	searchResponse(payload) {
		const {time, q, results} = payload;
		const start = Date.parse(time);
		const end = new Date();
		const diff = (end - start) / 1000;
		console.log(`receiveSearchResults text:"${q}" took ${diff}s`);
		this.onSearchResponse({q, results});
	}
}

export default WebWorkerEngineAdapter;
