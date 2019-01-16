import { ItemType, ClassCode } from '@store'

export interface Items {
	data: { [I in ItemType]: ItemData[] | null }
	isLoading: boolean
}

export interface ItemData {
	_id: string
	group: string
	name: string
	icon?: string
	grade: number
	classCode?: ClassCode
	stats?: ItemStat[]
	attributes?: ItemAttribute[]
	fuse?: string[]
}

export interface ItemStat {
	stat: string
	value: number
	group?: 'm1' | 'm2'
	stage?: number
}

export interface ItemAttribute {
	icon?: string
	msg: string
	values?: { [key: string]: any }
	group?: 'm1' | 'm2'
	stage?: number
}
