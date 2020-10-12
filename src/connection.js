const { EventEmitter } = require('events');
const Constants = require('./constants');
const Socket = require('./socket');

class Connection extends EventEmitter {
	queue = [];
	sockets = [];
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
		socket.on('stateChange', (state) => {
			this.emit('stateChange', socket, state);
		});
		this.emit('socketAdd', socket);
	}
	send(data, metadata = {}) {
		const options = Object.assign({}, Constants._SocketMessage, {
			...metadata,
			data
		});
		this.queue.push(options);
		return this._run();
	}
	async _run() {
		if (this.queue.length < 1) return;
		return this._execute(this.queue.shift());
	}
	async _execute(data) {
		const socket = this.sockets.find(s => s.state == Constants.SocketStates.OPEN);
		if (!socket) {
			this.queue.unshift(data);
			return null;
		}

		const socketIndex = this.sockets.indexOf(socket);
		if (socketIndex < 0) {
			this.queue.unshift(data);
			return null;
		}
		this.sockets.splice(socketIndex, 1);

		this.emit('socketRemove', socket);

		try {
			await socket.send(options);
		}
		catch(err) {
			this.emit('error', err);
			this.queue.unshift(data);
			return false;
		}

		return true;
	}
}

module.exports = Connection;