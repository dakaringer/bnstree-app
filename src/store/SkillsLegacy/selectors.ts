import { createSelector } from 'reselect'
import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'

const getSkills = (state: RootState) => state.skillsLegacy

export const getIsLoading = createSelector(
	getSkills,
	skills => skills.isLoading
)
export const getSkillPreferences = createSelector(
	userSelectors.getPreferences,
	preferences => preferences.skillsLegacy
)
export const getData = createSelector(
	getSkills,
	skills => skills.data
)
