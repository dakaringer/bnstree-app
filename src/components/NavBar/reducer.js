import {combineReducers} from 'redux-immutable'
import {fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        menuStatus: false,
        dropdownStatus: null,
        dropdownPosition: {}
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_NAVBAR_MENU_STATUS:
            return state.set('menuStatus', action.status)
        case actionType.SET_NAVBAR_DROPDOWN_STATUS:
            return state.set('dropdownStatus', action.status)
        case actionType.SET_NAVBAR_DROPDOWN_POSITION:
            return state.set('dropdownPosition', fromJS(action.position))
        default:
            return state
    }
}

export default combineReducers({ui})
