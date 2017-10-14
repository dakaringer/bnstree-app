import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(state = Map({tab: 'STATS'}), action) {
    switch (action.type) {
        case actionType.SET_CHARACTER_TAB:
            return state.set('tab', action.tab)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.SET_CHARACTER_DATA:
            if (action.characterData) {
                return fromJS(action.characterData)
            } else {
                return Map()
            }
        default:
            return state
    }
}

export default combineReducers({ui, data})
