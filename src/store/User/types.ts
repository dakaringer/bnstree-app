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
} from '@store'

export interface User {
	data: UserData | null
	preferences: UserPreferences
	showLogoutMessage: boolean
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
		specialization: { [C in ClassCode]: SkillSpecialization<C> }
		builds: { [C in ClassCode]: { [s in SkillSpecialization<C>]: number[] } | {} }
		stats: {
			ap: number
			apPet: number
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
		element: { [C in ClassCode]: SkillElement }
		build: {
			[C in ClassCode]: {
				[E in SkillElement]?: {
					[id: string]: number
				}
			}
		}
		stats: {
			ap: number
			ad: number
			c: number
			elementDamage: { [E in SkillElement]: number }
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
