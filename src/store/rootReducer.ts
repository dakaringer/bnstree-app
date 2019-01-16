import { combineReducers } from 'redux'

import { reduxActionTypes } from './rootActionTypes'
import { ReduxAction } from './rootActions'

import UserReducer, { State as UserState } from './User/reducers'
import IntlReducer, { State as IntlState } from './Intl/reducers'
import NameReducer, { State as NameState } from './Names/reducers'
import ResourceReducer, { State as ResourceState } from './Resources/reducers'
import CharacterReducer, { State as CharacterState } from './Character/reducers'
import SkillReducer, { State as SkillState } from './Skills/reducers'
import SkillReducerLegacy, { State as SkillStateLegacy } from './SkillsLegacy/reducers'
import ItemReducer, { State as ItemState } from './Items/reducers'

export interface RootState {
	isLoading: boolean
	intl: IntlState
	user: UserState
	names: NameState
	resources: ResourceState
	character: CharacterState
	skills: SkillState
	skillsLegacy: SkillStateLegacy
	items: ItemState
}

const isLoadedReducer = (state: boolean = true, action: ReduxAction) => {
	switch (action.type) {
		case reduxActionTypes.SET_LOADING: {
			return action.payload
		}
		default: {
			return state
		}
	}
}

export const rootReducer = combineReducers<RootState>({
	isLoading: isLoadedReducer,
	intl: IntlReducer,
	user: UserReducer,
	names: NameReducer,
	resources: ResourceReducer,
	character: CharacterReducer,
	skills: SkillReducer,
	skillsLegacy: SkillReducerLegacy,
	items: ItemReducer
})
