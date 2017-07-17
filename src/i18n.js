import i18n from 'i18next'

i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    fallbackNS: 'general',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react!!
    }
})

export default i18n
