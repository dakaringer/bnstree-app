import {
	ClassCode,
	SkillMode,
	SkillOrder,
	SkillVisibility,
	SkillElement,
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
		favorites: FavoriteCharacter[] | null
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

export interface FavoriteCharacter {
	region: CharacterRegion
	name: string
}
