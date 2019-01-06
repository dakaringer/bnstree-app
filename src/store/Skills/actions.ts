import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { Skill, Trait } from './types'
import { ClassCode } from '@src/store/constants'

const Actions = {
	// Saga actions
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<ClassCode>(),
	// Redux actions
	setData: createStandardAction(reduxActionTypes.SET_DATA)<{
		classCode: ClassCode
		data: Skill[]
		traits: Trait[]
	}>(),
	setClass: createStandardAction(reduxActionTypes.SET_CLASS)<ClassCode>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
