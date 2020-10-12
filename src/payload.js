const { EventEmitter } = require('events');

class Payload extends EventEmitter {
	constuctor(data, callback) {
		this.data = data;
		if (typeof callback == 'function') this.once('send', callback);
	}
}

module.exports = Payload;