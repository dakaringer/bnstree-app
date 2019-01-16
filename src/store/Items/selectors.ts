import { createSelector } from 'reselect'
import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'

const getItems = (state: RootState) => state.items

export const getIsLoading = createSelector(
	[getItems],
	items => items.isLoading
)
export const getItemPreferences = createSelector(
	[userSelectors.getPreferences],
	preferences => preferences.items
)
export const getData = createSelector(
	[getItems],
	items => items.data
)
