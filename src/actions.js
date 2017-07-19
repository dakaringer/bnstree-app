import * as actionType from './actionTypes'
import {makeActionCreator} from './helpers'
import i18n from './i18n'

const setLanguage = makeActionCreator(actionType.GENERAL_SET_LANGUAGE, 'language')
export const setUser = makeActionCreator(actionType.GENERAL_SET_USER, 'user')
export const setLoading = makeActionCreator(actionType.GENERAL_SET_LOADING, 'loading')
const setInitialized = makeActionCreator(actionType.GENERAL_SET_INITIALIZED, 'initialized')

export function setUILanguage(lang, initial) {
    return (dispatch, getState) => {
        dispatch(setInitialized(false))
        dispatch(setLanguage(lang))

        fetch(`https://api.bnstree.com/languages/${lang}${initial ? '?initial=true' : ''}`, {
            method: 'post',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                i18n.changeLanguage(json.lang)
                dispatch(setLanguage(json.lang))
                dispatch(setInitialized(true))
            }
        })
    }
}
