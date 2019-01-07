import { mergeWith } from 'lodash-es'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { User } from './types'
import Actions from './actions'

import {
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

export type State = DeepReadonly<User>

const initialState = {
	data: null,
	preferences: {
		skills: {
			search: '',
			mode: 'TRAITS' as SkillMode,
			specialization: {
				BM: 'empty' as SkillSpecialization<'BM'>,
				KF: 'empty' as SkillSpecialization<'KF'>,
				DE: 'empty' as SkillSpecialization<'DE'>,
				FM: 'empty' as SkillSpecialization<'FM'>,
				AS: 'empty' as SkillSpecialization<'AS'>,
				SU: 'empty' as SkillSpecialization<'SU'>,
				BD: 'BD_TEMPEST' as SkillSpecialization<'BD'>,
				WL: 'empty' as SkillSpecialization<'WL'>,
				SF: 'empty' as SkillSpecialization<'SF'>,
				GS: 'empty' as SkillSpecialization<'GS'>,
				WR: 'empty' as SkillSpecialization<'WR'>
			},
			builds: {
				BM: {},
				KF: {},
				DE: {},
				FM: {},
				AS: {},
				SU: {},
				BD: {},
				WL: {},
				SF: {},
				GS: {},
				WR: {}
			},
			stats: {
				ap: 13,
				ad: 0,
				c: 1,
				power: 100.0
			}
		},
		skillsLegacy: {
			search: '',
			mode: 'LIST' as SkillModeLegacy,
			order: 'LEVEL' as SkillOrder,
			visibility: 'ALL' as SkillVisibility,
			element: {
				BM: 'FLAME' as SkillElement,
				KF: 'WIND' as SkillElement,
				DE: 'EARTH' as SkillElement,
				FM: 'FLAME' as SkillElement,
				AS: 'SHADOW' as SkillElement,
				SU: 'WIND' as SkillElement,
				BD: 'WIND' as SkillElement,
				WL: 'FROST' as SkillElement,
				SF: 'EARTH' as SkillElement,
				GS: 'FLAME' as SkillElement,
				WR: 'LIGHTNING' as SkillElement
			},
			build: {
				BM: {
					FLAME: {},
					LIGHTNING: {}
				},
				KF: {
					WIND: {},
					FLAME: {}
				},
				DE: {
					EARTH: {},
					SHADOW: {}
				},
				FM: {
					FLAME: {},
					FROST: {}
				},
				AS: {
					SHADOW: {},
					LIGHTNING: {}
				},
				SU: {
					WIND: {},
					EARTH: {}
				},
				BD: {
					WIND: {},
					LIGHTNING: {}
				},
				WL: {
					FROST: {},
					SHADOW: {}
				},
				SF: {
					EARTH: {},
					FROST: {}
				},
				GS: {
					FLAME: {},
					SHADOW: {}
				},
				WR: {
					LIGHTNING: {},
					FROST: {}
				}
			},
			stats: {
				ap: 13,
				ad: 0,
				c: 1,
				elementDamage: {
					FLAME: 1,
					FROST: 1,
					WIND: 1,
					EARTH: 1,
					LIGHTNING: 1,
					SHADOW: 1
				}
			}
		},
		character: {
			region: 'NA' as CharacterRegion,
			favorites: null
		},
		items: {
			search: '',
			filter: 'ALL' as ItemFilter
		},
		market: {
			region: 'NA' as MarketRegion,
			favorites: null
		},
		locale: 'EN'
	},
	logoutMessage: false,
	isLoading: false
}

export default (state: State = initialState, action: Actions) => {
	switch (action.type) {
		case reduxActionTypes.SET_DATA: {
			return {
				...state,
				data: action.payload
			}
		}
		case reduxActionTypes.CLEAR_DATA: {
			return {
				...state,
				data: null
			}
		}
		case reduxActionTypes.SET_PREFERENCES: {
			if (!action.payload) return state

			const mergedPreferences = mergeWith({}, state.preferences, action.payload, (a, b) =>
				b === null ? a : undefined
			)

			return {
				...state,
				preferences: mergedPreferences
			}
		}
		case reduxActionTypes.SET_LOGOUT_MESSAGE: {
			return {
				...state,
				logoutMessage: action.payload
			}
		}
		default:
			return state
	}
}
