import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { ItemData } from './types'
import { ItemType } from '@store'

export const sagaActions = {
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ItemType>()
}

export const reduxActions = {
	setType: createStandardAction(reduxActionTypes.SET_TYPE)<ItemType>(),
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		itemType: ItemType
		data: ItemData[]
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
