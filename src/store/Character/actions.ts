import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { CharacterData } from './types'
import { CharacterRegion } from '@store'

export const sagaActions = {
	search: createStandardAction(sagaActionTypes.SEARCH)<{
		name: string
		region: CharacterRegion
	} | null>()
}

export const reduxActions = {
	setData: createStandardAction(reduxActionTypes.SET_DATA)<CharacterData | null>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
