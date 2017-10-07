import i18n from 'i18next'
import Fetch from 'i18next-fetch-backend'

function fetchData(url, options, callback) {
    fetch(url, options.init)
        .then(response => response.json())
        .then(locale => callback(locale, {status: '200'}))
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
        parse: data => data.languages,
        init: {
            method: 'get',
            credentials: 'include'
        },
        loadPath: 'https://api.bnstree.com/languages/{{ns}}/{{lng}}',
        addPath: 'https://api.bnstree.com/languages/{{ns}}/{{lng}}',
        ajax: fetchData
    },
    react: {
        wait: true
    }
})

export default i18n
