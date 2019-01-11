export default {
	LEVEL: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
	HOTKEY: (a: string, b: string) => {
		const order = ['LB', 'RB', 'F', 'TAB', '1', '2', '3', '4', 'Z', 'X', 'C', 'V', 'Q', 'E', 'S', 'NONE', 'G', 'B']
		return order.indexOf(a) - order.indexOf(b)
	}
}
