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
		this.setState(!res.writableFinished ? Constants.SocketStates.OPEN : Constants.SocketStates.CLOSED);
	}
	setState(state = Constants.SocketStates.OPEN) {
		this.state = state;
		return this.emit('stateChange', this.state);
	}
	send(opts = {}) {
		if (this.state == Constants.SocketStates.CLOSED) throw new Error('Socket already closed');

		this.setState(Constants.SocketStates.CLOSED);

		return this.res.status(200).send(opts);
	}
}

module.exports = GameSocket;