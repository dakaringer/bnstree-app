import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { RetryLink } from 'apollo-link-retry'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { onError } from 'apollo-link-error'

import { API_SERVER } from './constants'

import store from '@store/redux'
import { actions as userActions } from '@store/User'

const uri = `${API_SERVER}/graphql`

const link = ApolloLink.from([
	onError(({ response, graphQLErrors }) => {
		if (graphQLErrors) {
			const unauthorized = graphQLErrors.some(error => {
				return error.message.trim() === 'Unauthorized'
			})
			if (unauthorized) {
				store.dispatch(userActions.logout())
				if (response) {
					response.errors = undefined
				}
			}
		}
	}),
	new RetryLink(),
	new BatchHttpLink({ uri, credentials: 'include' })
])

const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData: {
		__schema: {
			types: [
				{
					kind: 'UNION',
					name: 'ProfileUnion',
					possibleTypes: [
						{
							name: 'Profile'
						},
						{
							name: 'ProfileFailed'
						}
					]
				}
			]
		}
	}
})

export default new ApolloClient({
	link,
	cache: new InMemoryCache({ fragmentMatcher })
})
