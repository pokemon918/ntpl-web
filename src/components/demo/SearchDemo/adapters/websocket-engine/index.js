import {w3cwebsocket as WebSocket} from 'websocket';

class WebSocketEngineAdapter {
	isReady = false;
	onSearchReady = null;
	onSearchError = null;
	onSearchResponse = null;

	constructor(onSearchReady, onSearchError, onSearchResponse) {
		this.onSearchReady = onSearchReady;
		this.onSearchError = onSearchError;
		this.onSearchResponse = onSearchResponse;
		this.load();
	}

	load() {
		this.client = new WebSocket('ws://127.0.0.1:8001');
		this.client.onopen = this.handleOpen;
		this.client.onerror = this.handleError;
		this.client.onmessage = this.handleMessage;
	}

	handleOpen = () => {
		const checkReadyState = () => {
			if (this.client.readyState !== this.client.OPEN) {
				setTimeout(checkReadyState, 500);
				return;
			}
			this.isReady = true;
			this.onSearchReady();
		};
		checkReadyState();
	};

	handleError = () => {
		this.onSearchError();
	};

	handleMessage = (message) => {
		const {type, ...data} = JSON.parse(message.data);

		const handlers = {
			findwine_response: this.receiveSearchResults,
		};
		if (!type || !handlers[type]) return;

		handlers[type](data);
	};

	search(q) {
		if (!this.isReady) return;
		this.client.send(
			JSON.stringify({
				type: 'findwine_request',
				time: new Date(),
				q,
			})
		);
	}

	receiveSearchResults = (data) => {
		const {q, time} = data;
		const start = Date.parse(time);
		const end = new Date();
		const diff = (end - start) / 1000;
		console.log(`receiveSearchResults text:"${q}" took ${diff}s`);
		this.onSearchResponse(data);
	};
}

export default WebSocketEngineAdapter;
