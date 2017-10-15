import i18n from 'i18next'
import Fetch from 'i18next-fetch-backend'
import localforage from 'localforage'
import apollo, {q} from './apollo'

let query = q`query i18next(
    $language: String!, 
    $namespace: String!
){
    Languages {
        languages (
            language: $language,
            namespace: $namespace
        )
    } 
}`

async function fetchData(variables, options, callback) {
    variables = JSON.parse(variables)
    let key = `${variables.language}:${variables.namespace}`
    let data = await localforage.getItem(key)
    if (data) {
        callback(data, {status: '200'})
    }

    apollo
        .query({
            query: query,
            variables: variables
        })
        .then(json => {
            data = json.data.Languages
            localforage.setItem(key, data)
            callback(data, {status: '200'})
        })
        .catch(e => callback(e, {status: '404'}))
}

i18n.use(Fetch).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: 'general',
    fallbackNS: 'general',
    defaultNS: 'general',
    debug: process.env.NODE_ENV !== 'production',
    preload: ['en'],
    interpolation: {
        escapeValue: false // not needed for react!!
    },
    backend: {
        parse: data => {
            return data.languages
        },
        init: {
            method: 'get',
            credentials: 'include'
        },
        loadPath: '{"language": "{{lng}}", "namespace": "{{ns}}"}',
        addPath: '{"language": "{{lng}}", "namespace": "{{ns}}"}',
        ajax: fetchData
    },
    react: {
        wait: true
    }
})

export default i18n
