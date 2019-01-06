import gql from 'graphql-tag'

export const loadDataQuery = gql`
	query skillData($classCode: ClassCode!) {
		skills {
			data(classCode: $classCode)
			traits(classCode: $classCode)
		}
	}
`
