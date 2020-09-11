const { EventEmitter } = require('events');
const Constants = require('./constants');

class GameSocket extends EventEmitter {
	queue = [];
	constructor(options = {}) {
		super();
		this.on('readyStateChange', (state) => {
			if (state == Constants.SocketStates.READY) {
				return this.emit('ready', this);
			}
		});
		this.gameID = options.gameID;
		this.req = options.req;
		this.res = options.res;
		this.setReadyState(Constants.SocketStates.READY);
	}
	setReadyState(state = Constants.SocketStates.READY) {
		this.readyState = state;
		return this.emit('readyStateChange', readyState);
	}
	send(opts = {}) {
		this.setReadyState(Constants.SocketStates.CLOSED);

		return this.res.status(200).send(opts);
	}
}