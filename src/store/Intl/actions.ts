import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'

export const sagaActions = {
	loadLocale: createStandardAction(sagaActionTypes.LOAD_LOCALE)<string>()
}

export const reduxActions = {
	setMessages: createStandardAction(reduxActionTypes.SET_MESSAGES)<{
		locale: string
		messages: {}
	}>(),
	setLoading: createStandardAction(reduxActionTypes.SET_LOADING)<boolean>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
