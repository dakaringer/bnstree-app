import {combineReducers} from 'redux-immutable'
import {fromJS} from 'immutable'
import * as actionType from './actionTypes'

import news from './components/News/reducer'
import skills from './components/Skills/reducer'
import items from './components/Items/reducer'
import character from './components/Character/reducer'
import streams from './components/Streams/reducer'
import market from './components/Market/reducer'
import translator from './components/Translator/reducer'

function general(
    state = fromJS({
        language: 'en',
        user: null,
        view: {},
        loading: {},
        loadingApp: true,
        supportedLanguages: [],
        recentSearch: []
    }),
    action
) {
    switch (action.type) {
        case actionType.GENERAL_SET_LANGUAGE:
            return state.set('language', fromJS(action.language))
        case actionType.GENERAL_SET_USER:
            return state.set('user', fromJS(action.user))
        case actionType.GENERAL_SET_VIEW:
            return state.merge({view: action.view})
        case actionType.GENERAL_SET_VIEW_CONTEXT:
            let pathArray = ['view']
            console.log(pathArray.concat(action.context))
            return state.setIn(pathArray.concat(action.context), action.value)
        case actionType.GENERAL_SET_LOADING:
            return state.setIn(['loading', action.context], action.loading)
        case actionType.GENERAL_SET_LOADING_APP:
            return state.set('loadingApp', action.loading)
        case actionType.GENERAL_SET_SUPPORTED_LANGUAGES:
            return state.set('supportedLanguages', fromJS(action.languages))
        case actionType.GENERAL_SET_RECENT_SEARCH:
            return state.set('recentSearch', fromJS(action.list))
        default:
            return state
    }
}

export default combineReducers({
    general,
    news,
    skills,
    items,
    market,
    character,
    streams,
    translator
})
