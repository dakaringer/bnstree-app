import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './rootActionTypes'

const Actions = {
	// Saga actions
	initialize: createStandardAction(sagaActionTypes.INIT)<void>(),
	// Redux actions
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
