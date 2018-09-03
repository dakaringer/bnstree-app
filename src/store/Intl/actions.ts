import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

const Actions = {
	// Saga actions
	loadLocale: createStandardAction(sagaActionTypes.LOAD_LOCALE)<string>(),
	// Redux actions
	setMessages: createStandardAction(reduxActionTypes.SET_MESSAGES)<{
		locale: string
		messages: {}
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
type Actions = ActionType<typeof Actions>

export default Actions
