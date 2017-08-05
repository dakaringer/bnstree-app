import * as actionType from './actionTypes'
import {makeActionCreator} from './helpers'
import i18n from './i18n'
import {currentLanguageSelector} from './selectors'

const setLanguage = makeActionCreator(actionType.GENERAL_SET_LANGUAGE, 'language')
const setUser = makeActionCreator(actionType.GENERAL_SET_USER, 'user')
export const setLoading = makeActionCreator(actionType.GENERAL_SET_LOADING, 'loading')
const setInitialized = makeActionCreator(actionType.GENERAL_SET_INITIALIZED, 'initialized')

export function setUILanguage(lang, initial) {
    return (dispatch, getState) => {
        let previousLanguage = currentLanguageSelector(getState())
        dispatch(setInitialized(false))

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
                        dispatch(setUser(json.user))
                    }
                } else {
                    i18n.changeLanguage(previousLanguage)
                    dispatch(setLanguage(previousLanguage))
                }

                dispatch(setInitialized(true))
            })
            .catch(() => {
                i18n.changeLanguage(previousLanguage)
                dispatch(setLanguage(previousLanguage))
                dispatch(setInitialized(true))
            })
    }
}
