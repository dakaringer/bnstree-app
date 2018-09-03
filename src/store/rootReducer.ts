import { combineReducers } from 'redux'

import { reduxActionTypes } from './rootActionTypes'
import Actions from './rootActions'

//import { reducer as GeneralReducer } from './General/reducers'
import UserReducer, { State as UserState } from './User/reducers'
import IntlReducer, { State as IntlState } from './Intl/reducers'
import ResourceReducer, { State as ResourceState } from './Resources/reducers'
import CharacterReducer, { State as CharacterState } from './Character/reducers'
import SkillReducer, { State as SkillState } from './Skills/reducers'
import ItemReducer, { State as ItemState } from './Items/reducers'

export interface RootState {
	isLoading: boolean
	intl: IntlState
	user: UserState
	resources: ResourceState
	character: CharacterState
	skills: SkillState
	items: ItemState
}

const isLoadedReducer = (state: boolean = true, action: Actions) => {
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
	resources: ResourceReducer,
	character: CharacterReducer,
	skills: SkillReducer,
	items: ItemReducer
})
