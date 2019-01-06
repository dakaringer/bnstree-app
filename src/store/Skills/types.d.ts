import { ClassCode, SkillSpecialization, Attribute } from '@src/store/constants'

export interface Skills {
	data: { [key in ClassCode]: Skill[] | null }
	traits: { [key in ClassCode]: Trait[] | null }
	isLoading: boolean
}

export interface Skill {
	_id: string
	specialization?: SkillSpecialization<ClassCode>
	data: SkillData
}

export interface SkillData {
	name: string
	icon?: string
	minLevel: number
	hotkey: string
	type: string
	focus?: number
	health?: number
	attributes?: SkillAttribute[]
	info?: MoveInfo
	stance_change?: SkillAttribute[]
	requirements?: SkillAttribute[]
	tags?: string[]
}

export interface MoveInfo {
	range: number
	area: {
		type: number
		range: number | number[]
	}
	cast: number
	cooldown: number
}

export interface SkillAttribute {
	icon?: string
	msg: string
	values?: { [key: string]: any }
	group?: 'm1' | 'm2'
	specialization?: SkillSpecialization<ClassCode>
	modId?: number
	delete?: boolean
}

export interface Trait {
	_id: string
	index: number[]
	specialization?: SkillSpecialization<ClassCode>
	classCode: ClassCode
	data: {
		name: string
		icon?: string
		skills: TraitSkill[]
	}
}

export interface TraitSkill {
	skillId?: string
	action?: 'ADD' | 'REPLACE' | 'REMOVE'
	data?: Partial<SkillData>
}
