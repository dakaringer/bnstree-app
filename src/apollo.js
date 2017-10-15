import {ApolloClient, createBatchingNetworkInterface, gql} from 'react-apollo'

const client = new ApolloClient({
    networkInterface: createBatchingNetworkInterface({
        uri: 'https://api.bnstree.com/graphql',
        opts: {
            credentials: 'include'
        }
    }),
    dataIdFromObject: o => {
        if (o.id) {
            return `${o.__typename}:${o.id}`
        }
    }
})

export const q = gql

export default client
