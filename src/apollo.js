import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const client = new ApolloClient({
    link: createHttpLink({
        //uri: 'https://api.bnstree.com/graphql',
        uri: 'http://localhost:3001/graphql',
        credentials: 'include'
    }),
    cache: new InMemoryCache({
        dataIdFromObject: o => {
            if (o.id) {
                return `${o.__typename}:${o.id}`
            }
        }
    })
})

export const q = gql

export default client
