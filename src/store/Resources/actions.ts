import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

export const sagaActions = {
	loadData: createStandardAction(sagaActionTypes.LOAD_DATA)<string>()
}

export const reduxActions = {
	setData: createStandardAction(reduxActionTypes.PATCH_DATA)<{}>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
