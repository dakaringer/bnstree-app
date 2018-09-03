export default {
	SOULBADGE: (a: string, b: string) => {
		const order = ['FUSED', 'LIME', 'BROWN', 'PURPLE', 'BLUE', 'GREEN', 'RED', 'YELLOW']
		return order.indexOf(a) - order.indexOf(b)
	},
	MYSTICBADGE: (a: string, b: string) => {
		const order = ['ARANSU', 'YELLOW', 'RED']
		return order.indexOf(a) - order.indexOf(b)
	},
	SOULSHIELD: (a: string, b: string) => {
		const order = ['GRAND_CELESTIAL', 'ARANSU', 'RAVEN']
		return order.indexOf(a) - order.indexOf(b)
	}
}
