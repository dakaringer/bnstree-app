import { createSelector } from 'reselect'
import { RootState } from '@src/store/rootReducer'
import { getPreferences } from '@src/store/User/selectors'

const getSkills = (state: RootState) => state.skills

export const getIsLoading = createSelector(getSkills, skills => skills.isLoading)
export const getSkillPreferences = createSelector(getPreferences, preferences => preferences.skills)
export const getData = createSelector(getSkills, skills => skills.data)
