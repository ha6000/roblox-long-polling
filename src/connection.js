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
	createSocket(req, res) {
		const socket = new Socket({
			req,
			res,
			gameID: this.gameID
		});
		this.sockets.push(socket);
		socket.on('readyStateChange', (state) => {
			this.emit('readyStateChange', socket, state);
		});
		this.emit('socketAdd', socket);
	}
	send(name, data) {
		const options = Object.assign({}, Constants._SocketMessage, {
			name,
			data
		});
		this.queue.push(options);
		return this.run();
	}
	async run() {
		if (this.queue.length < 1) return;
		return this.execute(this.queue.shift());
	}
	async execute(data) {
		const socket = this.sockets.find(s => s.readyState == Constants.SocketStates.READY);
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