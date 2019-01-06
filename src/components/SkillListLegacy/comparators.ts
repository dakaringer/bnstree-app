export default {
	LEVEL: (a: string, b: string) => parseInt(a) - parseInt(b),
	HOTKEY: (a: string, b: string) => {
		const order = ['LB', 'RB', 'F', 'TAB', '1', '2', '3', '4', 'Z', 'X', 'C', 'V', 'Q', 'E', 'S', 'NONE', 'G', 'B']
		return order.indexOf(a) - order.indexOf(b)
	}
}
