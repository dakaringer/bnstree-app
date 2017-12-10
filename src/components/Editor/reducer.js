import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        status: {
            saving: null,
            error: null
        },
        scrollPosition: 0
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_EDITOR_STATUS:
            return state.setIn(['status', action.context], action.value)
        case actionType.SET_EDITOR_SCROLL_POSITION:
            return state.set('scrollPosition', action.value)
        default:
            return state
    }
}

function data(
    state = Map({
        article: Map()
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_EDITOR_ARTICLE:
            return state.set('article', fromJS(action.article ? action.article : {}))
        case actionType.UPDATE_EDITOR_ARTICLE:
            return state.setIn(['article', action.context], action.value)
        default:
            return state
    }
}

export default combineReducers({ui, data})
