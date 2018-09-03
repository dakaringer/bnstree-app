import {combineReducers} from 'redux-immutable'
import {Map, List, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(state = Map({
    classCode: 'ALL',
    filter: 'ALL',
    keyword: '',
    currentTab: 0
}), action) {
    switch (action.type) {
        case actionType.SET_CLASS_FILTER:
            return state.set('classCode', action.classCode)
        case actionType.SET_SS_FILTER:
            return state.set('filter', action.filter)
        case actionType.SET_SS_SEARCH_KEYWORD:
            return state.set('keyword', action.keyword)
        case actionType.SET_SS_TAB:
            return state.set('currentTab', action.index)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_SS:
            return fromJS(action.list)
        default:
            return state
    }
}

const emptyEquip = {
    p1: null,
    p2: null,
    p3: null,
    p4: null,
    p5: null,
    p6: null,
    p7: null,
    p8: null
}

function tabs(state = List(), action) {
    switch (action.type) {
        case actionType.ADD_TAB:
            return state.push(fromJS(emptyEquip))
        case actionType.DELETE_TAB:
            return state.delete(action.index)
        case actionType.REPLACE_TABS: {
            let newList = List()
            return newList.push(fromJS(action.tab))
        }
        case actionType.EQUIP:
        case actionType.UNEQUIP:
            return state.set(action.index, equipData(state.get(action.index), action))
        default:
            return state
    }
}

function equipData(state = List(), action) {
    switch (action.type) {
        case actionType.EQUIP:
            return state.set(action.piece, action.pieceData)
        case actionType.UNEQUIP:
            return state.set(action.piece, null)
        default:
            return state
    }
}

function ref(state = fromJS({skills: {}, locations:{}, templates: {}}), action) {
    switch (action.type) {
        case actionType.SET_SKILLS:
            return state.mergeIn(['skills'], action.skills)
        case actionType.SET_LOCATIONS:
            return state.mergeIn(['locations'], action.locations)
        case actionType.SET_SS_TEMPLATES:
            return state.mergeIn(['templates'], action.templates)
        default:
            return state
    }
}

export default combineReducers({ui, data, tabs, ref})
