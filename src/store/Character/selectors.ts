import { createSelector } from 'reselect'
import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'

const getCharacter = (state: RootState) => state.character

export const getIsLoading = createSelector(
	[getCharacter],
	character => character.isLoading
)
export const getCharacterPreferences = createSelector(
	[userSelectors.getPreferences],
	preferences => preferences.character
)
export const getData = createSelector(
	[getCharacter],
	character => character.data
)
