import gql from 'graphql-tag'

export const loadLocaleQuery = gql`
	query localeMessages($locale: Locale!) {
		intl {
			messages(locale: $locale)
		}
	}
`
