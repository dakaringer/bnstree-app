import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { SkillData } from './types'
import { ClassCode } from '@store'

// Saga actions
const loadData = createStandardAction(sagaActionTypes.LOAD_DATA)<ClassCode>()

// Redux actions
const setData = createStandardAction(reduxActionTypes.SET_DATA)<{
	classCode: ClassCode
	data: SkillData[]
}>()
const setLoading = createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()

export const sagaActions = { loadData }
export const reduxActions = { setData, setLoading }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
