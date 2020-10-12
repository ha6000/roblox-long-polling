const { EventEmitter } = require('events');

/**
 * @class Payload that contains data
 */
class Payload extends EventEmitter {
	/**
	 * @param  {Object}   data     Data of the payload
	 * @param  {Function} callback callback that will be called when payload is send
	 */
	constuctor(data, callback) {
		this.data = data;
		/**
		 * Gets emitted when payload is send
		 * @event Payload#send
		 */
		if (typeof callback == 'function') this.once('send', callback);
	}
}

module.exports = Payload;