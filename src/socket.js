const { EventEmitter } = require('events');
const Constants = require('./constants');

class GameSocket extends EventEmitter {
	queue = [];
	constructor(options = {}) {
		super();
		options = Object.assign({}, Constants.SocketOptions, options);
		
		this.connection = options.connection;
		this.gameID = options.gameID;
		this.req = options.req;
		this.res = options.res;
		this.setReadyState(Constants.SocketStates.READY);
	}
	setReadyState(state = Constants.SocketStates.READY) {
		this.readyState = state;
		return this.emit('readyStateChange', this.readyState);
	}
	send(opts = {}) {
		this.setReadyState(Constants.SocketStates.CLOSED);

		return this.res.status(200).send(opts);
	}
}

module.exports = GameSocket;