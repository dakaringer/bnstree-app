import {combineReducers} from 'redux-immutable'
import {Map, List, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        language: 'en',
        namespace: 'none',
        group: 'none',
        loading: {},
        error: false
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_TRANSLATOR_LANGUAGE:
            return state.set('language', action.language)
        case actionType.SET_TRANSLATOR_NAMESPACE:
            return state.set('namespace', action.namespace)
        case actionType.SET_TRANSLATOR_GROUP:
            return state.set('group', action.group)
        case actionType.SET_TRANSLATOR_LOADING:
            return state.setIn(['loading', action.context], action.loading)
        case actionType.SET_TRANSLATOR_ERROR:
            return state.set('error', action.error)
        default:
            return state
    }
}

function data(
    state = Map({
        languageStatus: Map(),
        languageData: List(),
        referenceData: List()
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_TRANSLATOR_LANGUAGE_STATUS_DATA:
            return state.set('languageStatus', fromJS(action.data ? action.data : {}))
        case actionType.SET_TRANSLATOR_LANGUAGE_STATUS:
            return state.setIn(['languageStatus', 'enabled'], action.status)
        case actionType.SET_TRANSLATOR_LANGUAGE_NAME:
            return state.setIn(['languageStatus', 'name'], action.name)
        case actionType.SET_TRANSLATOR_LANGUAGE_DATA:
            return state.set('languageData', fromJS(action.data))
        case actionType.SET_TRANSLATOR_EN_REFERENCE:
            return state.set('referenceData', fromJS(action.data))
        case actionType.EDIT_TRANSLATOR_LANGUAGE_DATA:
            return state.setIn(['languageData', action.index], action.data)
        case actionType.PUSH_TRANSLATOR_LANGUAGE_DATA: {
            let list = state.get('languageData', List()).push(action.data)
            return state.set('languageData', list)
        }
        default:
            return state
    }
}

export default combineReducers({ui, data})
