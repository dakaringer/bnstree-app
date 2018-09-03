import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(state = Map({
    region: 'na',
    tab: 'profile',
    visibility: false
}), action) {
    switch (action.type) {
        case actionType.SET_REGION:
            return state.set('region', action.region)
        case actionType.SET_CHARACTER_TAB:
            return state.set('tab', action.tab)
        case actionType.SET_VISIBILITY:
            return state.set('visibility', action.visibility)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_CHARACTER:
            if (action.characterData) {
                return state.merge(fromJS(action.characterData))
            }
            else {
                return Map()
            }
        default:
            return state
    }
}

export default combineReducers({ui, data})
