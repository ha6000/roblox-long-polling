/**
 * @typedef {Object} ClientOptions
 * @property {String} token Your api's token
 */

const ClientOptions = {
	token: undefined
}
module.exports.ClientOptions = ClientOptions;

/**
 * @typedef {Object} SocketOptions
 * @property {express.Request} req The sockets request
 * @property {express.Response} res The sockets response
 * @property {String} gameID roblox gameID of socket
 */

const SocketOptions = {
	req: undefined,
	res: undefined,
	gameID: undefined
}
module.exports.SocketOptions = SocketOptions;

/**
 * @typedef {Object} SocketStates
 * @property {String} READY Socket is ready to recieve reply
 */

const SocketStates = {
	READY: 'READY',
	CLOSED: 'CLOSED'
}
module.exports = SocketStates;

const _SocketMessage {
	name: undefined,
	data: undefined
}
module.exports._SocketMessage = _SocketMessage;

/**
 * @typedef {Object} ConnectionOptions
 * @property {String} gameID The game id of the connection
 * @property {Array} sockets Sockets connected
 */

const ConnectionOptions = {
	gameID: undefined
}
module.exports.ConnectionOptions = ConnectionOptions;