import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

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

export default combineReducers({data})
