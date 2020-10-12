const RobloxPolling = require('../');
const express = require('express');
const app = express();

const pollingClient = new RobloxPolling.Client({
	port: 8080,
	secret: 'test'
});

app.use('/', pollingClient.listener());

pollingClient.send('73823', {
	'sup': false
});

pollingClient.broadcast({
	'yes': true
});

pollingClient.on('data', (socket, data) => {
	console.log(data);
});