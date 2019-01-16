import { createSelector } from 'reselect'
import { RootState } from '@store'

const getUser = (state: RootState) => state.user

export const getData = createSelector(
	[getUser],
	user => user.data
)
export const getPreferences = createSelector(
	[getUser],
	user => user.preferences
)
export const getShowLogoutMessage = createSelector(
	[getUser],
	user => user.showLogoutMessage
)
