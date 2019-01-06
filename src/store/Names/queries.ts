import gql from 'graphql-tag'

export const loadNamesQuery = gql`
	query names($locale: Locale!) {
		names {
			skill: data(type: skill, locale: $locale)
			trait: data(type: trait, locale: $locale)
			item: data(type: item, locale: $locale)
		}
	}
`
