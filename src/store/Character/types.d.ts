import { ClassCode, CharacterRegion } from '@src/store/constants'

export interface Character {
	data: CharacterData | null
	isLoading: boolean
}

export interface CharacterData {
	profile: CharacterProfile | { failed: string }
	stats: CharacterStats
	equipment: CharacterEquipment
	skills?: CharacterSkils
	otherCharacters: OtherCharacters
	votes: CharacterVotes
	badges: CharacterBadge[]
}

export interface CharacterProfile {
	account: string
	region: CharacterRegion
	name: string
	classCode: ClassCode
	level: number[]
	server: string
	faction: string | null
	clan: string | null
	profileImg: string
	arena: {
		stats: number[]
		solo: {
			rating: number
			wins: number
		}
		tag: {
			rating: number
			wins: number
		}
	}
	failed?: string
}

export interface CharacterStats {
	base_ability: { [key: string]: number }
	equipped_ability: { [key: string]: number }
	total_ability: { [key: string]: number }
	point_ability: any
}

export interface CharacterEquipment {
	weapon: {
		icon: string
		name: string
		grade: string
		gems: { icon: string }[]
	}
	accessories: { [key: string]: string }[]
	cosmetics: { [key: string]: string }[]
	soulshield: {
		pieces: { name: string; icon: string }[]
		stats: {
			stat: string
			total: string
			base: string
			fuse: string
			set: string
		}[]
	}
}

export interface CharacterSkils {
	elementIndex: number
	pageName: string
	build: { [id: string]: number }
}

export interface OtherCharacters {
	account: string
	list: string[]
}

export interface CharacterVotes {
	count: number
	userVoted: boolean
}

export interface CharacterBadge {
	name: string
	grade: number
	icon: string
}
