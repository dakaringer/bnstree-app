import { ClassCode, SkillElement, Attribute } from '@src/store/constants'

interface Skills {
	data: { [key in ClassCode]: SkillData[] | null }
	isLoading: boolean
}

interface SkillData {
	_id: string
	group: {
		patch: string
		minLevel: number
		hotkey: string
	}
	moves: MoveData[]
	element?: SkillElement
}

export interface MoveData {
	id?: string
	name: string
	icon?: string
	move: number
	type: string
	focus?: number
	health?: number
	attributes?: SkillAttribute[]
	info?: MoveInfo
	stance_change?: SkillAttribute[]
	requirements?: SkillAttribute[]
	element?: SkillElement
	tags?: string[]
	unlock?: {
		type: string
		skillName?: string
	}
}

interface MoveInfo {
	range: number | { [element in SkillElement]?: number }
	area:
		| {
				type: number
				range: number | number[]
		  }
		| {
				[element in SkillElement]?: {
					type: number
					range: number | number[]
				}
		  }
	cast: number | { [element in SkillElement]?: number }
	cooldown: number | { [element in SkillElement]?: number }
}

export interface SkillAttribute {
	icon?: string
	msg: string
	values?: { [key: string]: any }
	group?: 'm1' | 'm2'
	element?: SkillElement
}
