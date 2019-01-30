import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { SkillData } from './types'
import { ClassCode } from '@store'

export const sagaActions = {
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ClassCode>()
}

export const reduxActions = {
	setClass: createStandardAction(reduxActionTypes.SET_CLASS)<ClassCode>(),
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		classCode: ClassCode
		data: SkillData[]
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
