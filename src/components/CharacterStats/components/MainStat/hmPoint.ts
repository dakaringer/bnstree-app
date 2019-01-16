export const hmPointBuffs = {
	attack: [
		{
			index: 0,
			type: 'threat',
			icon: 'threat',
			label: 'hm_buff_threat_label',
			effect: 'hm_buff_threat_effect'
		},
		{
			index: 3,
			type: 'energy',
			icon: 'hm_energy',
			label: 'hm_buff_energy_label',
			effect: 'hm_buff_energy_effect'
		}
	],
	defense: [
		{
			index: 1,
			type: 'regen',
			icon: 'health_regen',
			label: 'hm_buff_regen_label',
			effect: 'hm_buff_regen_effect'
		},
		{
			index: 2,
			type: 'speed',
			icon: 'speed',
			label: 'hm_buff_speed_label',
			effect: 'hm_buff_speed_effect'
		},
		{
			index: 4,
			type: 'status',
			icon: 'status',
			label: 'hm_buff_status_label',
			effect: 'hm_buff_status_effect'
		}
	]
}

export const hmPointEffects = {
	attack: {
		m1: {
			statId: 'attack_power_value',
			icon: 'attack_power',
			value: 'attack_power_value'
		},
		m2: {
			statId: 'attack_attribute_element_value',
			icon: 'attack_power',
			value: 'attack_attribute_value'
		},
		sub: [
			{ req: 10, stat: [60, 60] },
			{ req: 20, stat: [40, 50] },
			{ req: 50, effect: 'hm_attack_effect_50' },
			{ req: 80, stat: [20, 30] },
			{ req: 100, stat: [15, 20] },
			{ req: 115, stat: [10, 15] },
			{ req: 125, effect: 'hm_attack_effect_125' }
		]
	},
	defense: {
		m1: {
			statId: 'max_hp',
			icon: 'health',
			value: 'max_hp'
		},
		m2: {
			statId: 'defend_power_value',
			icon: 'defense',
			value: 'defend_power_value'
		},
		sub: [
			{ req: 10, stat: [20000, 150] },
			{ req: 20, stat: [15000, 120] },
			{ req: 50, effect: 'hm_defense_effect_50' },
			{ req: 80, stat: [10000, 90] },
			{ req: 100, stat: [6000, 60] },
			{ req: 115, stat: [4000, 45] },
			{ req: 125, effect: 'hm_defense_effect_125' }
		]
	}
}
