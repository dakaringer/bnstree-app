import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './rootActionTypes'

export const sagaActions = {
	initialize: createStandardAction(sagaActionTypes.INIT)<void>(),
	reloadData: createStandardAction(sagaActionTypes.RELOAD_DATA)<void>()
}

export const reduxActions = {
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
