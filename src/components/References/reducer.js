import {combineReducers} from 'redux-immutable'
import {fromJS} from 'immutable'
import * as actionType from './actionTypes'

function data(state = fromJS({skillNames: {}}), action) {
    switch (action.type) {
        case actionType.REF_SET_SKILL_NAMES:
            return state.mergeDeepIn(['skillNames', action.language], action.nameData)
        case actionType.REF_SET_ITEM_NAMES:
            return state.mergeDeepIn(['itemNames', action.language], action.nameData)
        case actionType.REF_SET_PATCH_LIST:
            return state.set('patchList', fromJS(action.list))
        default:
            return state
    }
}

export default combineReducers({data})
