import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(state = Map({
    region: 'na',
    class: 'all',
    mode: 'solo'
}), action) {
    switch (action.type) {
        case actionType.SET_RANK_CLASS:
            return state.set('class', action.classCode)
        case actionType.SET_RANK_REGION:
            return state.set('region', action.region)
        case actionType.SET_RANK_MODE:
            return state.set('mode', action.mode)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_RANKING_DATA:
            return state.merge(fromJS(action.rankingData))
        default:
            return state
    }
}

export default combineReducers({ui, data})
