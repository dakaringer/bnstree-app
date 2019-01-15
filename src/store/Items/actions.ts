import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { ItemData } from './types'
import { ItemType } from '@store/constants'

const Actions = {
	// Saga actions
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ItemType>(),
	// Redux actions
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		itemType: ItemType
		data: ItemData[]
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
