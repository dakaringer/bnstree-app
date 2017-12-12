import {combineReducers} from 'redux-immutable'
import {Map} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = Map({
        view: 'news'
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_ADMIN_VIEW:
            return state.set('view', action.view)
        default:
            return state
    }
}

export default combineReducers({ui})
