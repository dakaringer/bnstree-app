import * as actionType from './actionTypes'
import {makeActionCreator} from './helpers'
import i18n from './i18n'

const setLanguage = makeActionCreator(actionType.GENERAL_SET_LANGUAGE, 'language')
export const setUIText = makeActionCreator(actionType.GENERAL_SET_UITEXT, 'language', 'namespace', 'uiText')
export const setUser = makeActionCreator(actionType.GENERAL_SET_USER, 'user')
export const setLoading = makeActionCreator(actionType.GENERAL_SET_LOADING, 'loading')
const setInitialized = makeActionCreator(actionType.GENERAL_SET_INITIALIZED, 'initialized')

export function initialize() {
    return (dispatch) => {
        dispatch(setLoading(true))
        let lang = navigator.language.substring(0, 2)

        fetch(`https://api.bnstree.com/languages/general/${lang}?initial=true`, {
            method: 'get',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setLanguage(json.lang))
                dispatch(setUIText(json.lang, 'general', json.languages))
                i18n.addResourceBundle(json.lang, 'general', json.languages, true)
                i18n.changeLanguage(json.lang)
                dispatch(setLoading(false))
                dispatch(setInitialized(true))
            }

            //Pre-load fallback language (en)
            if (json.lang !== 'en') {
                fetch('https://api.bnstree.com/languages/general/en', {
                    method: 'get',
                    credentials: 'include'
                }).then(response => response.json()).then(json => {
                    if (json.success === 1) {
                        dispatch(setUIText(json.lang, 'general', json.languages))
                        i18n.addResourceBundle(json.lang, 'general', json.languages, true)
                    }
                })
            }
        })
    }
}

export function setLanguageUI(lang) {
    return (dispatch, getState) => {
        dispatch(setInitialized(false))
        dispatch(setLanguage(lang))

        fetch(`https://api.bnstree.com/languages/general/${lang}`, {
            method: 'get',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setLanguage(json.lang))
                dispatch(setUIText(json.lang, 'general', json.languages))
                i18n.addResourceBundle(json.lang, 'general', json.languages, true)
                i18n.changeLanguage(json.lang)
                dispatch(setInitialized(true))
            }
        })
    }
}
