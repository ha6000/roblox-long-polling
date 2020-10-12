const Constants = require('./constants');
const Socket = require('./socket')
const Connection = require('./connection');
const Payload = require('./payload');

const { EventEmitter } = require('events');
const express = require('express');

/**
 * @class Base client to interact with sockets
 */
class Client extends EventEmitter {
	/**
	 * @param  {ClientOptions} options Options for the client
	 */
	constructor(options = {}) {
		super();
		this.options = Object.assign({}, Constants, options);
		this.connections = new Map();
	}
	/**
	 * Creates an express router
	 * @return {express.Router}
	 */
	listener() {
		return new express.Router()
			.post('/poll/:gameid', async (req, res) => {
				return this.createConnection(req.params.gameid, req, res);
			});
	}
	/**
	 * Listens on port specified or port in config
	 * @param  {Number} [port] The port to listen on
	 * @return {Promise<true>}      Returns true when it is listening
	 */
	listen(port) {
		return new Promise(res => {
			port = port || this.options.port;

			if (!port) throw new ReferenceError('No port specified');

			this.app = express();
			this.app.use('/r', this.listener());

			return this.app.listen(port, () => res(true));
		});
	}
	_createConnection(gameID, req, res) {
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

		connection._createSocket(req, res);
	}
	send(gameID, data) {
		const connection = this.connections.get(gameID);
		if (!connection) return new ReferenceError('No such gameID');

		return connection.send(data);
	}
	broadcast(data) {
		return Promise.allSettled(this.connections.values().map(connection => connection.send(payload)));
	}
}

module.exports = Client;