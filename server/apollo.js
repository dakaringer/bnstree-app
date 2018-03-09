const fetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')

const gqlClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.bnstree.com/graphql',
        fetch: fetch
    }),
    cache: new InMemoryCache()
})

module.exports = gqlClient
