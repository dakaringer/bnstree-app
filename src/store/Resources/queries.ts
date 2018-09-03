import gql from 'graphql-tag'

export const loadResourceQuery = gql`
	query resources($locale: Locale!) {
		resources {
			skill: data(type: skill, locale: $locale)
			item: data(type: item, locale: $locale)
		}
	}
`
