const express = require('express');
const app = express();
const Polling = require('../../index');

const client = new Polling.Client();

client.on('socketAdd', socket => {
	socket.send('Hi');
})

app.use('/p', client.middleware());

app.listen(3000, () => console.log('Listening on port 3000'));