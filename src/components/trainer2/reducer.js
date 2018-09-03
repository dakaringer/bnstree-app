import {combineReducers} from 'redux-immutable'
import {Map, List, fromJS} from 'immutable'
import * as actionType from './actionTypes'
import {viewModes, visibility, order} from './actions'

function ui(state = Map({
    classCode: null,
    mode: viewModes.SHOW_LIST,
    visibility: visibility.SHOW_ALL,
    filter: 'ALL',
    order: order.LEVEL,
    keyword: '',
    currentTab: 0,
    patch: 'BASE'
}), action) {
    switch (action.type) {
        case actionType.SET_CLASS:
            return state.set('classCode', action.classCode)
        case actionType.SET_VIEW_MODE:
            return state.set('mode', action.mode)
        case actionType.SET_VISIBILITY:
            return state.set('visibility', action.visibility)
        case actionType.SET_FILTER:
            return state.set('filter', action.filter)
        case actionType.SET_ORDER:
            return state.set('order', action.order)
        case actionType.SET_SEARCH_KEYWORD:
            return state.set('keyword', action.keyword)
        case actionType.SET_TAB:
            return state.set('currentTab', action.tabIndex)
        case actionType.SET_PATCH:
            return state.set('patch', action.patch)
        default:
            return state
    }
}

function character(state = fromJS({
    ap: 13,
    petAp: 5,
    ad: 0,
    c: 1,
    element: {
        flame: '100.00',
        frost: '100.00',
        lightning: '100.00',
        shadow: '100.00',
        wind: '100.00',
        earth: '100.00'
    }
}), action) {
    switch (action.type) {
        case actionType.SET_STAT:
            return state.set(action.stat, action.value)
        case actionType.SET_ELEMENT:
            return state.setIn(['element', action.element], action.value)
        default:
            return state
    }
}

function classData(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_CLASS:
        case actionType.SET_BUILD_CATALOG:
        case actionType.ADD_BUILD:
        case actionType.DELETE_BUILD:
        case actionType.LOAD_BUILD:
        case actionType.RENAME_BUILD:
        case actionType.SET_BUILD_ELEMENT:
        case actionType.SET_TYPE:
        case actionType.RESET_BUILD:
            return state.set(action.classCode, data(state.get(action.classCode, Map()), action))
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_CLASS:
            return state.merge({elements: action.elements, skills: action.skills})
        case actionType.SET_BUILD_CATALOG:
            return state.merge({buildCatalog: action.list})
        case actionType.ADD_BUILD:
        case actionType.DELETE_BUILD:
        case actionType.LOAD_BUILD:
        case actionType.RENAME_BUILD:
        case actionType.SET_BUILD_ELEMENT:
        case actionType.SET_TYPE:
        case actionType.RESET_BUILD:
            return state.set('builds', builds(state.get('builds', List()), action))
        default:
            return state
    }
}

const defaultBuild = {
    name: '',
    build: {},
    patch: 'BASE'
}

function builds(state = List(), action) {
    switch (action.type) {
        case actionType.ADD_BUILD:
            return state.push(fromJS(defaultBuild).set('element', action.defaultElement))
        case actionType.DELETE_BUILD:
            return state.delete(action.index)
        case actionType.LOAD_BUILD:
        case actionType.RENAME_BUILD:
        case actionType.SET_BUILD_ELEMENT:
        case actionType.SET_TYPE:
        case actionType.RESET_BUILD:
            return state.set(action.index, build(state.get(action.index, Map()), action))
        default:
            return state
    }
}

function build(state = Map(), action) {
    switch (action.type) {
        case actionType.RENAME_BUILD:
            return state.set('name', action.name)
        case actionType.SET_BUILD_ELEMENT:
            return state.set('element', action.element)
        case actionType.SET_TYPE:
            return state.setIn([
                'build', action.element, action.skill
            ], action.t)
        case actionType.LOAD_BUILD:
            return state.mergeIn(['build', action.element], action.build)
        case actionType.RESET_BUILD:
            return state.deleteIn(['build'])
        default:
            return state
    }
}

function ref(state = fromJS({skillIcons: {}, skillNames: {}, templates: {}, constants:{}, tags: {}, patchRef:{}}), action) {
    switch (action.type) {
        case actionType.SET_ICONS:
            return state.mergeIn(['skillIcons'], action.icons)
        case actionType.SET_SKILL_NAMES:
            return state.mergeIn(['skillNames'], action.names)
        case actionType.SET_TEMPLATES:
            return state.mergeIn(['templates'], action.templates)
        case actionType.SET_CONSTANTS:
            return state.mergeIn(['constants'], action.constants)
        case actionType.SET_TAGS:
            return state.mergeIn(['tags'], action.tags)
        case actionType.SET_PATCH_REF:
            return state.mergeIn(['patchRef'], action.patches)
        default:
            return state
    }
}

export default combineReducers({ui, character, classData, ref})
