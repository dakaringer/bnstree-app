import {ApolloClient, createNetworkInterface, gql} from 'react-apollo'

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: 'https://api.bnstree.com/graphql',
        opts: {
            credentials: 'include'
        },
        shouldBatch: true
    })
})

export const q = gql

export default client
