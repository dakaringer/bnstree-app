import {
	ClassCode,
	SkillMode,
	SkillModeLegacy,
	SkillOrder,
	SkillVisibility,
	SkillElement,
	SkillSpecialization,
	CharacterRegion,
	ItemFilter,
	MarketRegion
} from '@src/store/constants'

export interface User {
	data: UserData | null
	preferences: UserPreferences
	logoutMessage: boolean
	isLoading: boolean
}

export interface UserData {
	displayName: string
	profileImg: string
	permissions: string[] | null
}

export interface UserPreferences {
	skills: {
		search: string
		mode: SkillMode
		specialization: { [key in ClassCode]: SkillSpecialization<key> }
		build: { [c in ClassCode]: { [s in SkillSpecialization<c>]: {} } | {} }
		stats: {
			ap: number
			ad: number
			c: number
			power: number
		}
	}
	skillsLegacy: {
		search: string
		mode: SkillModeLegacy
		order: SkillOrder
		visibility: SkillVisibility
		element: { [key in ClassCode]: SkillElement }
		build: {
			[key in ClassCode]: {
				[key in SkillElement]?: {
					[id: string]: number
				}
			}
		}
		stats: {
			ap: number
			ad: number
			c: number
			elementDamage: { [key in SkillElement]: number }
		}
	}
	character: {
		region: CharacterRegion
	}
	items: {
		search: string
		filter: ItemFilter
	}
	market: {
		region: MarketRegion
	}
	locale: string
}
