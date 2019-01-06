import { createSelector } from 'reselect'
import { RootState } from '@src/store/rootReducer'
import { getPreferences } from '@src/store/User/selectors'

const getCharacter = (state: RootState) => state.character

export const getIsLoading = createSelector(
	[getCharacter],
	character => character.isLoading
)
export const getCharacterPreferences = createSelector(
	[getPreferences],
	preferences => preferences.character
)
export const getData = createSelector(
	[getCharacter],
	character => character.data
)
