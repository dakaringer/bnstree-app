const API_SERVER =
	process.env.NODE_ENV === 'production'
		? 'https://next-api.bnstree.com'
		: process.env.NODE_ENV === 'staging'
			? 'https://next-api.bnstree.com'
			: 'http://localhost:4001'

const STATIC_SERVER = 'https://static.bnstree.com'

module.exports = {
	API_SERVER,
	STATIC_SERVER
}
