const Constants = require('./constants');
const Socket = require('./socket')

const { EventEmitter } = require('events');
const express = require('express');

const Connection = require('./connection');

class Client extends EventEmitter {
	constructor(options = {}) {
		super();
		this.options = Object.assign({}, Constants, options);
		this.connections = new Map();
	}
	middleware() {
		return new express.Router()
			.post('/poll/:gameid', async (req, res) => {
				return this.createConnection(req.params.gameid, req, res);
			});
	}
	createConnection(gameID, req, res) {
		if (!gameID) return;

		let connection = this.connections.get(gameID);
		if (!connection) {
			connection = new Connection({
				gameID
			});
			this.connections.set(gameID, connection);
			connection.on('socketAdd', (socket) => {
				this.emit('socketAdd', socket);
			});
			connection.on('socketRemove', (socket) => {
				this.emit('socketRemove', socket);
			});
			connection.on('readyStateChange', (socket, state) => {
				this.emit('readyStateChange', socket, state);
			});
			this.emit('connectionAdd', connection);
		}

		connection.createSocket(req, res);
	}
}

module.exports = Client;