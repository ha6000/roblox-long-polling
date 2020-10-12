const { EventEmitter } = require('events');
const Constants = require('./constants');

/**
 * Socket for send data to roblox
 */
class Socket extends EventEmitter {
	/**
	 * @param  {SocketOptions} options Options for the socket
	 */
	constructor(options = {}) {
		super();
		options = Object.assign({}, Constants.SocketOptions, options);
		
		this.connection = options.connection;
		this.gameID = options.gameID;
		this.req = options.req;
		this.res = options.res;
		this.setState(!res.writableFinished ? Constants.SocketStates.OPEN : Constants.SocketStates.CLOSED);
	}
	/**
	 * Sets state of socket and emits stateChange
	 * @param {SocketStateResolvable} state State to change to
	 */
	setState(state = Constants.SocketStates.OPEN) {
		this.state = state;
		/**
		 * When state of socket changes
		 * @event Socket#stateChange
		 * @type {SocketStateResolvable}
		 */
		return this.emit('stateChange', this.state);
	}
	/**
	 * Sends data through socket and closes it
	 * @param  {Object} opts Data to send
	 * @return {Promise}      Promise that will resolve when sended
	 */
	send(opts = {}) {
		if (this.state == Constants.SocketStates.CLOSED) throw new Error('Socket already closed');

		this.setState(Constants.SocketStates.CLOSED);

		return this.res.status(200).send(opts);
	}
}

module.exports = Socket;