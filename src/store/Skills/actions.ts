import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { Skill, Trait } from './types'
import { ClassCode } from '@store'

// Saga actions
export const sagaActions = {
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ClassCode>(),
	reloadData: createStandardAction(sagaActionTypes.RELOAD_DATA)()
}

export const reduxActions = {
	setClass: createStandardAction(reduxActionTypes.SET_CLASS)<ClassCode>(),
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		classCode: ClassCode
		data: Skill[]
		traits: Trait[]
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
