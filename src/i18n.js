import i18n from 'i18next'
import Fetch from 'i18next-fetch-backend'
import apollo, {q} from './apollo'

function fetchData(url, options, callback) {
    let query = q`query i18next{
        Languages {
            languages (${url})
        } 
     }`

    apollo
        .query({query: query})
        .then(json => json.data.Languages)
        .then(locale => callback(locale, {status: '200'}))
        .catch(e => callback(e, {status: '404'}))
}

i18n.use(Fetch).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: 'general',
    fallbackNS: 'general',
    defaultNS: 'general',
    //debug: process.env.NODE_ENV !== 'production',
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
        loadPath: 'language: "{{lng}}", namespace: "{{ns}}"',
        addPath: 'language: "{{lng}}", namespace: "{{ns}}"',
        ajax: fetchData
    },
    react: {
        wait: true
    }
})

export default i18n
