import {combineReducers} from 'redux-immutable'
import {Map} from 'immutable'
import * as actionType from './actionTypes'

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.SET_NEWS_LIST:
            return state.merge({list: action.list})
        case actionType.SET_NEWS_ARTICLE:
            return state.merge({article: action.article})
        default:
            return state
    }
}

export default combineReducers({data})
