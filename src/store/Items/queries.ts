import gql from 'graphql-tag'

export const loadDataQuery = gql`
	query itemData($type: ItemType!) {
		items {
			data(type: $type)
		}
	}
`
