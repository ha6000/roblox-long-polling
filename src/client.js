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
				return this.createSocket({
					req,
					res,
					gameID: req.query.gameid
				});
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

		}

		connection.createSocket(req, res);	
	}
}