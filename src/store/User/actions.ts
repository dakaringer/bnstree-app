import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { UserData, UserPreferences } from './types'

export const sagaActions = {
	idTokenLogin: createStandardAction(sagaActionTypes.ID_TOKEN_LOGIN)<string>(),
	logout: createStandardAction(sagaActionTypes.LOGOUT)<void>(),
	updatePreferences: createStandardAction(sagaActionTypes.UPDATE_PREFERENCES)<DeepPartial<UserPreferences>>(),
	updatePreferencesNoSave: createStandardAction(reduxActionTypes.SET_PREFERENCES)<DeepPartial<UserPreferences>>()
}

export const reduxActions = {
	setData: createStandardAction(reduxActionTypes.SET_DATA)<UserData>(),
	clearData: createStandardAction(reduxActionTypes.CLEAR_DATA)<void>(),
	setShowLogoutMessage: createStandardAction(reduxActionTypes.SET_LOGOUT_MESSAGE)<boolean>(),
	setPreferences: createStandardAction(reduxActionTypes.SET_PREFERENCES)<DeepPartial<UserPreferences>>()
}
export type ReduxAction = ActionType<typeof reduxActions>

export default { ...sagaActions, ...reduxActions }
