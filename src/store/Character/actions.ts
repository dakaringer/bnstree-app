import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { CharacterData } from './types'
import { CharacterRegion } from '@store'

// Saga actions
const search = createStandardAction(sagaActionTypes.SEARCH)<{
	name: string
	region: CharacterRegion
} | null>()

// Redux actions
const setData = createStandardAction(reduxActionTypes.SET_DATA)<CharacterData | null>()
const setLoading = createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()

export const sagaActions = { search }
export const reduxActions = { setData, setLoading }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
