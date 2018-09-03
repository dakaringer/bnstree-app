import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { SkillData } from './types'
import { ClassCode } from '@src/store/constants'

const Actions = {
	// Saga actions
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ClassCode>(),
	// Redux actions
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		classCode: ClassCode
		data: SkillData[]
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
