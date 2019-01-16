import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

// Saga actions
const loadData = createStandardAction(sagaActionTypes.LOAD_DATA)<string>()

// Redux actions
const setData = createStandardAction(reduxActionTypes.PATCH_DATA)<{}>()

export const sagaActions = { loadData }
export const reduxActions = { setData }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
