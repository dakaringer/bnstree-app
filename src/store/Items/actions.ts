import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { ItemData } from './types'
import { ItemType } from '@store'

// Saga actions
const loadData = createStandardAction(sagaActionTypes.LOAD_DATA)<ItemType>()

// Redux actions
const setData = createStandardAction(reduxActionTypes.SET_DATA)<{
	itemType: ItemType
	data: ItemData[]
}>()
const setLoading = createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()

export const sagaActions = { loadData }
export const reduxActions = { setData, setLoading }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
