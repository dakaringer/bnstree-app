import { createSelector } from 'reselect'
import { get, transform } from 'lodash-es'
import { RootState } from '@src/store/rootReducer'
import { getLocale } from '@src/store/Intl/selectors'

export const getResource = (state: RootState) => state.resources.data

export const getSkillNames = createSelector(getResource, getLocale, (resources, locale) => {
	const names = get(resources, 'skill', {})
	return transform(
		names,
		(
			result: {
				key: string
				value: string
			}[],
			value,
			key
		) => result.push({ key, value: value.name[locale] }),
		[]
	)
})

export const getItemNames = createSelector(getResource, getLocale, (resources, locale) => {
	const names = get(resources, 'item', {})
	return transform(
		names,
		(
			result: {
				key: string
				value: string
			}[],
			value,
			key
		) => result.push({ key, value: value.name[locale] }),
		[]
	)
})
