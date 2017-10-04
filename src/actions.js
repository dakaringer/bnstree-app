import * as actionType from './actionTypes'
import {makeActionCreator} from './helpers'
import i18n from './i18n'
import {currentLanguageSelector} from './selectors'

const setLanguage = makeActionCreator(actionType.GENERAL_SET_LANGUAGE, 'language')
const setUser = makeActionCreator(actionType.GENERAL_SET_USER, 'user')
export const setLoading = makeActionCreator(actionType.GENERAL_SET_LOADING, 'loading', 'context')
const setLoadingApp = makeActionCreator(actionType.GENERAL_SET_LOADING_APP, 'loading', 'context')
const setSupportedLanguages = makeActionCreator(
    actionType.GENERAL_SET_SUPPORTED_LANGUAGES,
    'languages'
)

export function setUILanguage(lang, initial) {
    return (dispatch, getState) => {
        let previousLanguage = currentLanguageSelector(getState())

        fetch(`https://api.bnstree.com/languages/${lang}${initial ? '?initial=true' : ''}`, {
            method: 'post',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    i18n.changeLanguage(json.lang)
                    dispatch(setLanguage(json.lang))

                    if (initial) {
                        dispatch(setSupportedLanguages(json.supportedLanguages))
                    }
                } else {
                    i18n.changeLanguage(previousLanguage)
                    dispatch(setLanguage(previousLanguage))
                }
            })
            .then(() => dispatch(setLoadingApp(false, 'language')))
            .catch(() => {
                i18n.changeLanguage(previousLanguage)
                dispatch(setLanguage(previousLanguage))
                dispatch(setLoadingApp(false, 'language'))
            })

        if (initial) {
            fetch('https://api.bnstree.com/user', {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.loggedIn === 1) dispatch(setUser(json))
                })
                .then(() => dispatch(setLoadingApp(false, 'user')))
                .catch(() => dispatch(setLoadingApp(false, 'user')))
        }
    }
}
