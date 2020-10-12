/**
 * @typedef {Object} ClientOptions
 * @property {String} [secret] Your api's secret
 * @property {Number} [port] Port to listen on
 */

const ClientOptions = {
	port: 8080,
	secret: undefined
}
module.exports.ClientOptions = ClientOptions;

/**
 * @typedef {Object} SocketOptions
 * @property {Connection} connection The connection the socket belongs to
 * @property {express.Request} req The sockets request
 * @property {express.Response} res The sockets response
 * @property {String} gameID roblox gameID of socket
 */

const SocketOptions = {
	connection: undefined,
	req: undefined,
	res: undefined,
	gameID: undefined,
}
module.exports.SocketOptions = SocketOptions;

/**
 * @typedef {Object} SocketStates
 * @property {Number} OPEN Socket is ready to send reply
 * @property {Number} CLOSED Socket is closed and can not send data
 */

const SocketStates = {
	OPEN: 1,
	CLOSED: 0
}
module.exports.SocketStates = SocketStates;

/**
 * @typedef {Object} ConnectionOptions
 * @property {String} gameID The game id of the connection
 */

const ConnectionOptions = {
	gameID: undefined
}
module.exports.ConnectionOptions = ConnectionOptions;