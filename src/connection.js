const { EventEmitter } = require('events');
const Constants = require('./constants');
const Socket = require('./socket');
const Payload = require('./payload');

/**
 * Connection to roblox
 */
class Connection extends EventEmitter {
	queue = [];
	sockets = [];
	/**
	 * @param  {ConnectionOptions} opts Options for the connection
	 */
	constructor(opts = {}) {
		super();
		opts = Object.assign({}, Constants.ConnectionOptions, opts);
		this.gameID = opts.gameID;
	}
	_createSocket(req, res) {
		const socket = new Socket({
			req,
			res,
			gameID: this.gameID
		});
		this.sockets.push(socket);
		/**
		 * When sockets state changes
		 * @event Connection#stateChange
		 * @param {Socket}
		 * @param {SocketStateResolvable}
		 */
		socket.on('stateChange', (state) => {
			this.emit('stateChange', socket, state);
		});
		/**
		 * When socket gets added to connection
		 * @event Connection#socketAdd
		 * @type {Socket}
		 */
		this.emit('socketAdd', socket);
	}
	/**
	 * Sends request with one of the sockets
	 * @param  {PayloadResolvable} payloads Data to send
	 * @return {Array|Promise}          allSettled array or promise
	 */
	send(payloads) {
		return new Promise((res, rej) => {
			if (Array.isArray(payloads)) {
				return Promise.allSettled(this._handlePayloads());
			}
			else {
				const { 0: payload } = _handlePayloads([payloads]);

				return payload;
			}
		});
	}
	_handlePayloads(requests) {
		const payloads = requests.map(p => {
			return new Promise(res => {
				const payload = p instanceof Payload ? p : new Payload(p);

				payload.once('send', res);
			});
		});
		this.queue.push(...payloads);
		this._run();

		return payloads;
	}
	_run() {
		if (this.queue.length < 1) return;
		return this._execute();
	}
	async _execute() {
		const socket = this.sockets.find(s => s.state == Constants.SocketStates.OPEN);
		if (!socket) {
			return null;
		}

		const socketIndex = this.sockets.indexOf(socket);
		if (socketIndex < 0) {
			return null;
		}
		this.sockets.splice(socketIndex, 1);

		/**
		 * When socket gets removed from connection
		 * @event Connection#socketRemove
		 * @type {Socket}
		 */
		this.emit('socketRemove', socket);

		const queue = this.queue.concat();
		this.queue = [];

		try {
			await socket.send(queue.map(p => p.data));
		}
		catch(err) {
			this.emit('error', err);
			this.queue.unshift(...queue);
			return false;
		}

		queue.forEach(p => p.emit('send'));

		return true;
	}
}

module.exports = Connection;