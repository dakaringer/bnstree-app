import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { CharacterData } from './types'
import { CharacterRegion } from '@src/store/constants'

const Actions = {
	// Saga actions
	search: createStandardAction(sagaActionTypes.SEARCH)<{
		name: string
		region: CharacterRegion
	}>(),
	// Redux actions
	setData: createStandardAction(reduxActionTypes.SET_DATA)<CharacterData>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
