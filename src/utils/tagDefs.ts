import { get } from 'lodash'
import { SkillAttribute } from '@src/store/Skills/types'
import { DeepReadonlyArray } from '@src/utils/immutableHelper'

type tagDef = {
	tag: string
	test: (attb: SkillAttribute, otherAttb?: DeepReadonlyArray<SkillAttribute>) => boolean
}

const tagDefs: tagDef[] = [
	{
		tag: 'STUN',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'stun'
	},
	{
		tag: 'DAZE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'daze'
	},
	{
		tag: 'KNOCKDOWN',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'knockdown'
	},
	{
		tag: 'KNOCKBACK',
		test: attribute =>
			attribute.msg.startsWith('inflict_knockback') &&
			attribute.msg !== 'inflict_knockback.push' &&
			attribute.msg !== 'inflict_knockback.throw'
	},
	{
		tag: 'UNCONSCIOUS',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'unconscious'
	},
	{
		tag: 'GRAB',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'grab'
	},
	{
		tag: 'PHANTOM_GRIP',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'phantom_grip'
	},
	{
		tag: 'GRAPPLE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'grapple'
	},
	{
		tag: 'AERIAL',
		test: attribute => attribute.msg.startsWith('inflict_airborne')
	},
	{
		tag: 'PULL',
		test: attribute => attribute.msg.startsWith('inflict_pull')
	},
	{
		tag: 'DEEP_FREEZE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'deep_freeze'
	},
	{
		tag: 'ROOT',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'root'
	},
	{
		tag: 'CHILL',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'chill'
	},
	{
		tag: 'FREEZE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'freeze'
	},
	{
		tag: 'BLEED',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'bleed'
	},
	{
		tag: 'DEEP_WOUND',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'deep_wound'
	},
	{
		tag: 'DISABLE_CHARGE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'disable_charge'
	},
	{
		tag: 'DISABLE_DEFENSE',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'disable_defense'
	},
	{
		tag: 'DISABLE_OFFENSIVE_DEFENSE',
		test: attribute =>
			attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'disable_offensive_defense'
	},
	{
		tag: 'JOINT_ATTACK',
		test: (attribute, otherAttributes) =>
			attribute.msg.startsWith('inflict_') &&
			['stun', 'daze', 'knockdown'].includes(get(attribute, 'values.status')) &&
			!!otherAttributes &&
			otherAttributes.findIndex(attb => attb.msg === 'skill_property.no_joint_attack') < 0
	},
	{
		tag: 'JOINT_ATTACK',
		test: attribute =>
			attribute.msg.startsWith('inflict_knockback') &&
			!attribute.msg.startsWith('inflict_knockback.push') &&
			!attribute.msg.startsWith('inflict_knockback.throw')
	},
	{
		tag: 'HEAL',
		test: attribute => attribute.msg.startsWith('heal')
	},
	{
		tag: 'LIFESTEAL',
		test: attribute => attribute.msg.startsWith('lifesteal')
	},
	{
		tag: 'RESTRAIN',
		test: attribute => attribute.msg.startsWith('inflict_') && get(attribute, 'values.status') === 'restrain'
	},
	{
		tag: 'PROJECTILE',
		test: attribute => attribute.msg === 'skill_type.projectile'
	},
	{
		tag: 'CHARGE',
		test: attribute => attribute.msg === 'skill_type.charge'
	},
	{
		tag: 'DEFENSE',
		test: (attribute, otherAttributes) =>
			(attribute.msg.startsWith('defense.block') || attribute.msg.startsWith('defense.counter')) &&
			attribute.msg !== 'defense.counter_enemy_timing' &&
			!!otherAttributes &&
			otherAttributes.findIndex(attb => attb.msg === 'skill_type.offensive_defense') < 0
	},
	{
		tag: 'OFFENSIVE_DEFENSE',
		test: attribute => attribute.msg === 'skill_type.offensive_defense'
	},
	{
		tag: 'BLOCK',
		test: attribute => attribute.msg.startsWith('defense.block')
	},
	{
		tag: 'COUNTER',
		test: attribute => attribute.msg.startsWith('defense.counter')
	},
	{
		tag: 'DEFLECT',
		test: attribute => attribute.msg.startsWith('defense.deflect')
	},
	{
		tag: 'RESIST_DAMAGE',
		test: attribute =>
			attribute.msg.startsWith('resist.') && attribute.msg !== 'resist.party_projectile_within_area'
	},
	{
		tag: 'RESIST_STATUS',
		test: attribute =>
			(attribute.msg.startsWith('resist.') && attribute.msg !== 'resist.party_projectile_within_area') ||
			attribute.msg.startsWith('resist_status')
	},
	{
		tag: 'RESIST_PROJECTILE',
		test: attribute =>
			attribute.msg === 'resist.party_projectile_within_area' ||
			attribute.msg === 'defense.projectile_resist_frontal'
	},
	{
		tag: 'DEFENSE_PENETRATION',
		test: attribute => attribute.msg === 'defense_penetration.all'
	},
	{
		tag: 'DEFLECT_PENETRATION',
		test: attribute =>
			attribute.msg === 'defense_penetration.all' || attribute.msg === 'defense_penetration.deflect'
	},
	{
		tag: 'DEFENSE_BREAK',
		test: attribute => attribute.msg === 'defense_penetration.break'
	},
	{
		tag: 'THREAT',
		test: attribute =>
			(attribute.msg.startsWith('stat_up') && get(attribute, 'values.stat') === 'threat') ||
			attribute.msg === 'threat.multiply'
	},
	{
		tag: 'TAUNT',
		test: attribute => attribute.msg === 'threat.taunt'
	},
	{
		tag: 'MOVEMENT',
		test: (attribute, otherAttributes) =>
			attribute.msg.startsWith('move') &&
			!!otherAttributes &&
			otherAttributes.findIndex(attb => attb.msg === 'skill_type.charge') < 0
	},
	{
		tag: 'RECOVER',
		test: attribute => attribute.msg.startsWith('remove_status.recover')
	},
	{
		tag: 'SOULBLADE_PROTECTION',
		test: attribute => attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'sword_shroud'
	},
	{
		tag: 'SOULBLADE_PROTECTION',
		test: attribute => attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'sword_shroud'
	},
	{
		tag: 'STEALTH_PROTECTION',
		test: attribute =>
			attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'stealth_protection'
	},
	{
		tag: 'FREEZE_PROTECTION',
		test: attribute =>
			attribute.msg.startsWith('buff.party') &&
			(get(attribute, 'values.buff') === 'de_iron_flower' || get(attribute, 'values.buff') === 'fm_frost_sheath')
	},
	{
		tag: 'AMPLIFICATION',
		test: attribute => attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'amplification'
	},
	{
		tag: 'SOULBURN',
		test: attribute => attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'soulburn'
	},
	{
		tag: 'SOULBURST',
		test: attribute => attribute.msg.startsWith('buff.party') && get(attribute, 'values.buff') === 'soulburst'
	},
	{
		tag: 'TIME_DISTORTION',
		test: attribute => attribute.msg == 'cd_reset.party_all_multiple_over_time'
	},
	{
		tag: 'REVIVE',
		test: attribute => attribute.msg == 'revive.all'
	}
]

export default tagDefs
