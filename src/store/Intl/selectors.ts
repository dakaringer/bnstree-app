import { createSelector } from 'reselect'
import { RootState } from '@store'
import { selectors as userSelectors } from '@store/User'
import flat from 'flat'

const getIntl = (state: RootState) => state.intl

export const getLocale = createSelector(
	[userSelectors.getPreferences],
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
