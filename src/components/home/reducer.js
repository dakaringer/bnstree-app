import {combineReducers} from 'redux-immutable'
import {List, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function latestNews(state = List(), action) {
    switch (action.type) {
        case actionType.SET_LATEST_NEWS:
            return state.merge(fromJS(action.articles))
        default:
            return state
    }
}

function latestBuilds(state = List(), action) {
    switch (action.type) {
        case actionType.SET_LATEST_BUILDS:
            return state.merge(fromJS(action.builds.list.slice(0, 5)))
        default:
            return state
    }
}

export default combineReducers({latestNews, latestBuilds})
