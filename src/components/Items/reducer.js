import {combineReducers} from 'redux-immutable'
import {fromJS, Map} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        type: 'badge',
        search: '',
        patch: 'BASE'
    }),
    action
) {
    switch (action.type) {
        case actionType.ITEM_UI_SET_TYPE:
            return state.set('type', action.itemType)
        case actionType.ITEM_UI_SET_SEARCH:
            return state.set('search', action.search)
        case actionType.ITEM_UI_SET_PATCH:
            return state.set('patch', action.patch)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.ITEM_DATA_SET_DATA:
            let data = {}
            data[action.itemType] = action.data
            return state.merge(data)
        case actionType.ITEM_DATA_SET_ITEM_PATCH_DATA:
            return state.setIn([action.itemType, 'patchData', action.patch], fromJS(action.list))
        default:
            return state
    }
}

export default combineReducers({ui, data})
