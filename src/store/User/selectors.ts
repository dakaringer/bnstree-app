import { createSelector } from 'reselect'
import { RootState } from '@store/rootReducer'

const getUser = (state: RootState) => state.user

export const getData = createSelector(
	[getUser],
	user => user.data
)
export const getPreferences = createSelector(
	[getUser],
	user => user.preferences
)
export const getLogoutMessage = createSelector(
	[getUser],
	user => user.logoutMessage
)
