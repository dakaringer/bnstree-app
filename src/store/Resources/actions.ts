import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

const Actions = {
	// Saga actions
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<string>(),
	// Redux actions
	setData: createStandardAction(reduxActionTypes.PATCH_DATA)<{}>()
}
type Actions = ActionType<typeof Actions>

export default Actions
