import { createSelector } from 'reselect'
import { groupBy } from 'lodash-es'
import Fuse from 'fuse.js'

import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'
import { selectors as resourceSelectors } from '@store/Resources'
import { selectors as intlSelectors } from '@store/Intl'

const getItems = (state: RootState) => state.items

export const getIsLoading = createSelector(
	[getItems],
	items => items.isLoading
)
export const getItemPreferences = createSelector(
	[userSelectors.getPreferences],
	preferences => preferences.items
)
export const getCurrentType = createSelector(
	[getItems],
	items => items.currentType
)
export const getData = createSelector(
	[getItems, getCurrentType, resourceSelectors.getResource, intlSelectors.getLocale],
	(items, type, names, locale) => {
		const data = (items.data[type] || []).map(item => {
			const nameData = names.item[item.name]

			if (!nameData) {
				console.error(`[BnSTree] Missing item name data: "${item.name}"`)
				return item
			}

			return {
				...item,
				id: item.name,
				name: nameData.name[locale],
				icon: nameData.icon
			}
		})

		return data
	}
)
export const getFilteredItems = createSelector(
	[getData, getItemPreferences],
	(itemData, itemPreferences) => {
		let data = itemData.filter(item => {
			return itemPreferences.filter === 'ALL' || !item.classCode || item.classCode === itemPreferences.filter
		})

		if (itemPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['name']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(itemPreferences.search)
		}

		return groupBy(data, item => item.group)
	}
)
