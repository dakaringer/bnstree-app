const fetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { InMemoryCache, IntrospectionFragmentMatcher } = require('apollo-cache-inmemory')
const { ApolloLink } = require('apollo-link')
const { RetryLink } = require('apollo-link-retry')
const { BatchHttpLink } = require('apollo-link-batch-http')

const { API_SERVER } = require('./constants')

const uri = `${API_SERVER}/graphql`

const link = ApolloLink.from([new RetryLink(), new BatchHttpLink({ uri, fetch })])

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

const gqlClient = new ApolloClient({
	link,
	cache: new InMemoryCache({ fragmentMatcher })
})

module.exports = gqlClient
