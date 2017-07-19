import i18n from 'i18next'
import Fetch from 'i18next-fetch-backend'

i18n
  .use(Fetch)
  .init({
    whitelist: ['en', 'ko'],
    lng: 'en',
    fallbackLng: 'en',
    ns: 'general',
    fallbackNS: 'general',
    defaultNS: 'general',
    debug: true,
    preload: ['en'],
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    backend: {
      parse: (data) => {
        return JSON.parse(data).languages
      },
      init: {
        method: 'get',
        credentials: 'include'
      },
      loadPath: 'https://api.bnstree.com/languages/{{ns}}/{{lng}}',
      addPath: 'https://api.bnstree.com/languages/{{ns}}/{{lng}}'
    },
    react: {
      wait: true
    }
})

export default i18n
