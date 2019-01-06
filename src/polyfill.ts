export default new Promise(async resolve => {
	if (!Array.prototype.flat) {
		await require(['array.prototype.flat'], flat => {
			flat.shim()
		})
	}
	if (!global.Intl) {
		await require(['intl'], Intl => {
			global.Intl = Intl
		})
	}
	resolve()
})
