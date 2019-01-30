import { combineReducers } from 'redux'

import { reduxActionTypes } from './rootActionTypes'
import { ReduxAction } from './rootActions'

import userReducer, { State as UserState } from './User/reducers'
import intlReducer, { State as IntlState } from './Intl/reducers'
import nameReducer, { State as NameState } from './Names/reducers'
import resourceReducer, { State as ResourceState } from './Resources/reducers'
import characterReducer, { State as CharacterState } from './Character/reducers'
import skillReducer, { State as SkillState } from './Skills/reducers'
import skillReducerLegacy, { State as SkillStateLegacy } from './SkillsLegacy/reducers'
import itemReducer, { State as ItemState } from './Items/reducers'

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
	intl: intlReducer,
	user: userReducer,
	names: nameReducer,
	resources: resourceReducer,
	character: characterReducer,
	skills: skillReducer,
	skillsLegacy: skillReducerLegacy,
	items: itemReducer
})
