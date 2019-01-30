import { createSelector } from 'reselect'
import { get, groupBy } from 'lodash-es'
import Fuse from 'fuse.js'

import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'
import { selectors as resourceSelectors } from '@store/Resources'
import { selectors as intlSelectors } from '@store/Intl'

const getSkills = (state: RootState) => state.skillsLegacy

export const getIsLoading = createSelector(
	[getSkills],
	skills => skills.isLoading
)
export const getSkillPreferences = createSelector(
	[userSelectors.getPreferences],
	preferences => preferences.skillsLegacy
)
export const getCurrentClass = createSelector(
	[getSkills],
	skills => skills.currentClass
)
export const getElement = createSelector(
	[getSkillPreferences, getCurrentClass],
	(preferences, classCode) => {
		return preferences.element[classCode]
	}
)
export const getData = createSelector(
	[
		state => getSkills(state).data,
		getCurrentClass,
		getElement,
		resourceSelectors.getResource,
		intlSelectors.getLocale,
		intlSelectors.getMessages
	],
	(skillData, classCode, element, names, locale, messages) => {
		const tagList = get(messages, 'skill.tag', {})
		const skillNames = names.skill

		const data = (skillData[classCode] || []).map(skill => {
			const moves = skill.moves
				.map(move => {
					const nameData = skillNames[move.name] || skillNames[`${move.name}-${element.toLocaleLowerCase()}`]

					if (!nameData) {
						console.error(`[BnSTree] Missing skill name data: "${move.name}"`)
						return null
					}

					const tags = (move.tags || []).map(tag => tagList[tag])

					return {
						...move,
						id: move.name,
						name: nameData.name[locale],
						icon: nameData.icon,
						tags
					}
				})
				.filter(move => move) as typeof skill.moves

			return {
				...skill,
				moves
			}
		})

		return data
	}
)
export const getFilteredSkills = createSelector(
	[getData, getSkillPreferences, getElement, (_state: RootState, props: { readonly?: boolean }) => props.readonly],
	(skillData, skillPreferences, element, readonly) => {
		let data = skillData.filter(skill => {
			const moves = skill.moves.filter(move => get(move, 'element', element) === element)
			return (!readonly && skillPreferences.visibility === 'ALL') || moves.length > 1
		})

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['moves.name', 'moves.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		return groupBy(data, skill => skill.group.minLevel)
	}
)
