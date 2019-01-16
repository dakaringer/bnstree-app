import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

// Saga actions
const loadLocale = createStandardAction(sagaActionTypes.LOAD_LOCALE)<string>()

// Redux actions
const setMessages = createStandardAction(reduxActionTypes.SET_MESSAGES)<{
	locale: string
	messages: {}
}>()
const setLoading = createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()

export const sagaActions = { loadLocale }
export const reduxActions = { setMessages, setLoading }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
