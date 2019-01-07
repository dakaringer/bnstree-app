import { createSelector } from 'reselect'
import { get, groupBy } from 'lodash-es'
import Fuse from 'fuse.js'
import { getNameData, mergeSkills, getTags } from '@src/utils/helpers'

import { DeepReadonly, DeepReadonlyArray } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { getPreferences } from '@src/store/User/selectors'
import { SkillData } from './types'

const getSkills = (state: RootState) => state.skills

export const getIsLoading = createSelector(
	[getSkills],
	skills => skills.isLoading
)
export const getSkillPreferences = createSelector(
	[getPreferences],
	preferences => preferences.skills
)
export const getCurrentClass = createSelector(
	[getSkills],
	skills => skills.currentClass
)
export const getSpecialization = createSelector(
	[getSkillPreferences, getCurrentClass],
	(preferences, classCode) => {
		return preferences.specialization[classCode]
	}
)
export const getBuild = createSelector(
	[getSkillPreferences, getCurrentClass, getSpecialization],
	(preferences, classCode, specialization) => {
		const build: DeepReadonlyArray<number> = get(preferences, ['builds', classCode, specialization], [])
		return build
	}
)
export const getData = createSelector(
	[state => getSkills(state).data, getCurrentClass, getSpecialization],
	(skillData, classCode, specialization) => {
		const data = (skillData[classCode] || [])
			.filter(skill => get(skill, 'specialization', specialization) === specialization)
			.map(skill => {
				return {
					...skill,
					data: {
						...skill.data,
						...getNameData(skill.data.nameId, 'skill')
					}
				}
			})

		return data
	}
)
export const getSkillsWithTags = createSelector(
	[getData],
	skillData => {
		return skillData.map(skill => ({
			...skill,
			data: {
				...skill.data,
				tags: getTags(skill.data)
			}
		}))
	}
)
export const getFilteredSkills = createSelector(
	[getSkillsWithTags, getSkillPreferences, getCurrentClass],
	(skillData, skillPreferences) => {
		let data = skillData

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['data.name', 'data.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		return groupBy(
			data.sort((a, b) => {
				if (a._id < b._id) return -1
				if (a._id > b._id) return 1
				return 0
			}),
			skill => skill.data.minLevel
		)
	}
)
export const getTraits = createSelector(
	[state => getSkills(state).traits, getCurrentClass, getSpecialization, getData],
	(traits, classCode, specialization, skillData) => {
		const data = (traits[classCode] || [])
			.filter(trait => get(trait, 'specialization', specialization) === specialization)
			.map(trait => {
				const nameData = getNameData(trait.data.nameId, 'trait')

				if (!nameData) return trait

				return {
					...trait,
					data: {
						...trait.data,
						name: nameData.name,
						icon: nameData.icon,
						skills: trait.data.skills.map(traitSkill => {
							const targetSkillData = skillData.find(skill => skill._id === traitSkill.skillId)

							let traitData: DeepReadonly<SkillData> = traitSkill.data as DeepReadonly<SkillData>
							if (traitData) {
								if (targetSkillData && traitSkill.action !== 'REPLACE') {
									traitData = mergeSkills(targetSkillData.data, traitData)
								}

								const nameData = traitData.nameId && getNameData(traitData.nameId, 'skill')

								traitData = {
									...traitData,
									...nameData,
									tags: getTags(traitData)
								}
							}

							return {
								...traitSkill,
								name: targetSkillData && targetSkillData.data.name,
								icon: targetSkillData && targetSkillData.data.icon,
								data: traitData
							}
						})
					}
				}
			})

		return data
	}
)
export const getFilteredTraits = createSelector(
	[getTraits, getSkillPreferences, getCurrentClass],
	(traitData, skillPreferences) => {
		let data = traitData

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['data.name', 'data.skills.name', 'data.skills.data.name', 'data.skills.data.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		return groupBy(data.sort((a, b) => a.index[1] - b.index[1]), trait => trait.index[0])
	}
)
