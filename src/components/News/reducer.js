import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function editor(
    state = fromJS({
        article: Map(),
        saved: false
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_EDITOR_ARTICLE:
            return state.set('article', fromJS(action.article))
        case actionType.UPDATE_EDITOR_ARTICLE:
            return state.setIn(['article', action.context], action.value)
        case actionType.SET_EDITOR_SAVED:
            return state.set('saved', action.saved)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.SET_NEWS_LIST:
            return state.set('list', fromJS(action.list))
        case actionType.SET_NEWS_ARTICLE:
            return state.set('article', fromJS(action.article))
        default:
            return state
    }
}

export default combineReducers({data, editor})
