import { createSelector } from 'reselect'
import { RootState } from '@store/rootReducer'
import { getPreferences } from '@store/User/selectors'
import { get, transform } from 'lodash-es'
import * as flat from 'flat'

const getIntl = (state: RootState) => state.intl

export const getLocale = createSelector(
	[getPreferences],
	preferences => preferences.locale
)
export const getMessages = createSelector(
	[getIntl, getLocale],
	(intl, locale) => intl.messages[locale] || {}
)

export const getFlatMessages = createSelector(
	[getMessages],
	messages => {
		return flat(messages)
	}
)

export const getTags = createSelector(
	[getMessages],
	messages => {
		const tags = get(messages, 'skill.tag', {})
		return transform(
			tags,
			(
				result: {
					key: string
					value: string
				}[],
				value: string,
				key: string
			) => result.push({ key, value }),
			[]
		)
	}
)
