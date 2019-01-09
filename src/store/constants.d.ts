type Specializations = {
	BM: 'empty'
	KF: 'empty'
	DE: 'empty'
	FM: 'empty'
	AS: 'empty'
	SU: 'empty'
	BD: 'BD_TEMPEST' | 'BD_FLASH'
	WL: 'WL_DISTORTION' | 'WL_INFLICTION'
	SF: 'empty'
	GS: 'empty'
	WR: 'empty'
}

export type ClassCode = keyof Specializations
export type ClassCodeLegacy = 'BM' | 'KF' | 'DE' | 'FM' | 'AS' | 'SU' | 'BD' | 'WL' | 'SF' | 'GS' | 'WR'

export type SkillMode = 'TRAITS' | 'LIST' | 'GRID'
export type SkillModeLegacy = 'COMPACT' | 'LIST' | 'GRID'
export type SkillOrder = 'LEVEL' | 'HOTKEY'
export type SkillVisibility = 'ALL' | 'TRAINABLE'
export type SkillElement = 'FLAME' | 'FROST' | 'WIND' | 'EARTH' | 'LIGHTNING' | 'SHADOW'
export type SkillSpecialization<C extends ClassCode> = Specializations[C]

export type CharacterRegion = 'NA' | 'EU' | 'KR' | 'TW'

export type ItemType = 'SOULBADGE' | 'MYSTICBADGE' | 'SOULSHIELD'
export type ItemFilter = 'ALL' | ClassCode

export type MarketRegion = 'NA' | 'EU'
