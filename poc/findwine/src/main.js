const WebSocketServer = require('websocket').server;
const http = require('http');

const logger = require('./logger');
const {loadWineData, searchWine} = require('./wine');

const {PORT} = process.env;

loadWineData().then((winesCount) => {
	logger.info('%s Loaded data of %s wines', new Date(), winesCount);
});

const server = http.createServer((req, res) => {
	logger.info('%s Received request for %s', new Date(), req.url);
	res.writeHead(404);
	res.end();
});

server.listen(PORT, () => {
	logger.info('%s Server is listening on port %s', new Date(), PORT);
});

const ws = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const isOriginAllowed = (origin) => true;

ws.on('request', (req) => {
	if (!isOriginAllowed(req.origin)) {
		req.reject();
		logger.info('%s Rejected connection from origin %s', new Date(), req.origin);
		return;
	}

	const connection = req.accept(null, req.origin);
	logger.info('%s Accepted connection', new Date());

	connection.on('message', (message) => {
		if (message.type === 'utf8') {
			logger.info('%s Received message: %s', new Date(), message.utf8Data);
			handleMessage(connection, message.utf8Data);
		} else {
			logger.info('%s Discarded message of type %s', new Date(), message.type);
		}
	});

	connection.on('close', (reasonCode, description) => {
		logger.info('%s Disconnected %s', new Date(), connection.remoteAddress);
	});
});

function handleMessage(connection, packet) {
	try {
		const {type, ...data} = JSON.parse(packet);

		const handlers = {
			findwine_request: answerSearch,
		};
		if (!type || !handlers[type]) return;

		handlers[type](connection, data);
	} catch (err) {
		logger.error('%s Failed to parse message! %s', new Date(), packet);
	}
}

function answerSearch(connection, data) {
	const {q, time} = data;
	const results = searchWine(q);
	connection.send(JSON.stringify({type: 'findwine_response', q, time, results}));
}
