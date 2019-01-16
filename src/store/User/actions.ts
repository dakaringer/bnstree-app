import { createStandardAction, ActionType } from 'typesafe-actions'

import { sagaActionTypes, reduxActionTypes } from './actionTypes'
import { UserData, UserPreferences } from './types'

// Saga actions
const idTokenLogin = createStandardAction(sagaActionTypes.ID_TOKEN_LOGIN)<string>()
const logout = createStandardAction(sagaActionTypes.LOGOUT)<void>()
const updatePreferences = createStandardAction(sagaActionTypes.UPDATE_PREFERENCES)<DeepPartial<UserPreferences>>()
const updatePreferencesNoSave = createStandardAction(reduxActionTypes.SET_PREFERENCES)<DeepPartial<UserPreferences>>()

// Redux actions
const setData = createStandardAction(reduxActionTypes.SET_DATA)<UserData>()
const clearData = createStandardAction(reduxActionTypes.CLEAR_DATA)<void>()
const setShowLogoutMessage = createStandardAction(reduxActionTypes.SET_LOGOUT_MESSAGE)<boolean>()
const setPreferences = createStandardAction(reduxActionTypes.SET_PREFERENCES)<DeepPartial<UserPreferences>>()

export const sagaActions = { idTokenLogin, logout, updatePreferences, updatePreferencesNoSave }
export const reduxActions = { setData, clearData, setShowLogoutMessage, setPreferences }
const actions = { ...sagaActions, ...reduxActions }
export type ReduxAction = ActionType<typeof reduxActions>
export default actions
