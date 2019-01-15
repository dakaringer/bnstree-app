export const stats = {
	attack: [
		{
			statId: 'attack_power_value',
			icon: 'attack_power',
			subStats: [],
			essential: true
		},
		{
			statId: 'pc_attack_power_value',
			icon: 'attack_power_pvp',
			subStats: [],
			essential: true
		},
		{
			statId: 'boss_attack_power_value',
			icon: 'attack_power_boss',
			subStats: [],
			essential: true
		},
		{
			statId: 'attack_pierce_value',
			icon: 'piercing',
			subStats: ['attack_defend_pierce_rate', 'attack_parry_pierce_rate']
		},
		{
			statId: 'attack_hit_value',
			icon: 'accuracy',
			subStats: ['attack_hit_rate'],
			essential: true
		},
		{
			statId: 'attack_concentrate_value',
			icon: 'concentration',
			subStats: ['attack_perfect_parry_damage_rate', 'attack_counter_damage_rate']
		},
		{
			statId: 'attack_critical_value',
			icon: 'critical_hit',
			subStats: ['attack_critical_rate'],
			essential: true
		},
		{
			statId: 'attack_critical_damage_value',
			icon: 'critical_damage',
			subStats: ['attack_critical_damage_rate'],
			essential: true
		},
		{
			statId: 'attack_stiff_duration_level',
			icon: 'mastery',
			subStats: ['attack_stiff_duration_rate']
		},
		{
			statId: 'attack_damage_modify_diff',
			icon: 'additional_damage',
			subStats: ['attack_damage_modify_rate']
		},
		{
			statId: 'hate_power_value',
			icon: 'threat',
			subStats: ['hate_power_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_fire_value',
			icon: 'flame_damage',
			subStats: ['attack_attribute_fire_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_ice_value',
			icon: 'frost_damage',
			subStats: ['attack_attribute_ice_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_wind_value',
			icon: 'wind_damage',
			subStats: ['attack_attribute_wind_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_earth_value',
			icon: 'earth_damage',
			subStats: ['attack_attribute_earth_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_lightning_value',
			icon: 'lightning_damage',
			subStats: ['attack_attribute_lightning_rate'],
			essential: true
		},
		{
			statId: 'attack_attribute_void_value',
			icon: 'shadow_damage',
			subStats: ['attack_attribute_void_rate'],
			essential: true
		},
		{
			statId: 'abnormal_attack_power_value',
			icon: 'debuff_damage',
			subStats: ['abnormal_attack_power_rate'],
			essential: true
		}
	],
	defense: [
		{
			statId: 'max_hp',
			icon: 'health',
			subStats: [],
			essential: true
		},
		{
			statId: 'defend_power_value',
			icon: 'defense',
			subStats: ['defend_physical_damage_reduce_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate'],
			essential: true
		},
		{
			statId: 'pc_defend_power_value',
			icon: 'defense_pvp',
			subStats: ['pc_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate'],
			essential: true
		},
		{
			statId: 'boss_defend_power_value',
			icon: 'defense_boss',
			subStats: ['boss_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate'],
			essential: true
		},
		{
			statId: 'defend_dodge_value',
			icon: 'evasion',
			subStats: ['defend_dodge_rate', 'counter_damage_reduce_rate'],
			essential: true
		},
		{
			statId: 'defend_parry_value',
			icon: 'block',
			subStats: ['defend_parry_rate', 'defend_parry_reduce_rate', 'perfect_parry_damage_reduce_rate'],
			essential: true
		},
		{
			statId: 'defend_critical_value',
			icon: 'critical_defense',
			subStats: ['defend_critical_rate', 'defend_critical_damage_rate'],
			essential: true
		},
		{
			statId: 'defend_stiff_duration_level',
			icon: 'willpower',
			subStats: ['defend_stiff_duration_rate']
		},
		{
			statId: 'defend_damage_modify_diff',
			icon: 'damage_reduction',
			subStats: ['defend_damage_modify_rate']
		},
		{
			statId: 'int_hp_regen',
			icon: 'health_regen',
			subStats: ['hp_regen', 'hp_regen_combat'],
			essential: true
		},
		{
			statId: 'heal_power_value',
			icon: 'recovery',
			subStats: ['heal_power_diff', 'heal_power_rate'],
			essential: true
		},
		{
			statId: 'abnormal_defend_power_value',
			icon: 'debuff_defense',
			subStats: ['abnormal_defend_power_rate'],
			essential: true
		}
	]
}

export const classElements: { [key: string]: string[] } = {
	BM: ['attack_attribute_fire_value', 'attack_attribute_lightning_value'],
	KF: ['attack_attribute_fire_value', 'attack_attribute_wind_value'],
	DE: ['attack_attribute_earth_value', 'attack_attribute_void_value'],
	FM: ['attack_attribute_fire_value', 'attack_attribute_ice_value'],
	AS: ['attack_attribute_lightning_value', 'attack_attribute_void_value'],
	SU: ['attack_attribute_wind_value', 'attack_attribute_earth_value'],
	BD: ['attack_attribute_wind_value', 'attack_attribute_lightning_value'],
	WL: ['attack_attribute_ice_value', 'attack_attribute_void_value'],
	SF: ['attack_attribute_ice_value', 'attack_attribute_earth_value'],
	GS: ['attack_attribute_fire_value', 'attack_attribute_void_value'],
	WR: ['attack_attribute_ice_value', 'attack_attribute_lightning_value']
}

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
