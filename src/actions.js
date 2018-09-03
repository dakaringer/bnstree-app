import * as actionType from './actionTypes'
import {pair, makeActionCreator} from './components/shared/actionHelpers'

import {
    currentLanguageSelector
} from './selector'

const setLanguage = makeActionCreator(actionType.SET_LANGUAGE, 'language')
const setUI = makeActionCreator(actionType.SET_UI_TEXT, 'ui')
const setOrders = makeActionCreator(actionType.SET_ORDERS, 'orders')
export const setUser = makeActionCreator(actionType.SET_USER, 'user')
export const setLoading = makeActionCreator(actionType.SET_LOADING, 'loading')
export const setNews = makeActionCreator(actionType.SET_NEWS, 'news')

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

export function initialize() {
    return (dispatch) => {
        let lang = navigator.language.substring(0, 2)

        if (window.user) {
            dispatch(setUser(window.user))
            window.user = null
        }

        fetch('/api/general/getUiData', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({lang: lang, initial: true})
        }).then(response => response.json()).then(json => {
            dispatch(setLanguage(json.lang))
            dispatch(setUI(pair(json.ui, json.lang)))
            dispatch(setOrders(pair(json.orders, 'order')))
        })
    }
}

export function setLanguageUI(lang) {
    return (dispatch, getState) => {
        let currentLang = currentLanguageSelector(getState())

        if (currentLang != lang) {
            fetch('/api/general/getUiData', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({lang: lang})
            }).then(response => response.json()).then(json => {
                dispatch(setLanguage(json.lang))
                dispatch(setUI(pair(json.ui, json.lang)))
            })
        }
    }
}
