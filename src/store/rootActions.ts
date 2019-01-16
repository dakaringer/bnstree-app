import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './rootActionTypes'

// Saga actions
const initialize = createStandardAction(sagaActionTypes.INIT)<void>()

// Redux actions
const setLoading = createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()

export const sagaActions = { initialize }
export const reduxActions = { setLoading }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
