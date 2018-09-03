import {combineReducers} from 'redux-immutable'
import {Map, List, fromJS} from 'immutable'
import * as actionType from './actionTypes'
import {viewModes, visibilityFilters} from './actions'

function ui(state = Map({
    language: 'en',
    mode: viewModes.SHOW_LIST,
    visibility: visibilityFilters.SHOW_ALL,
    keyword: '',
    job: null,
    currentSkill: null,
    currentTree: null,
    hoverNode: null,
    currentTab: 0,
    loading: false
}), action) {
    switch (action.type) {
        case actionType.SET_LANGUAGE:
            return state.set('language', action.locale)
        case actionType.SET_VIEW_MODE:
            return state.set('mode', action.mode)
        case actionType.SET_VISIBILITY:
            return state.set('visibility', action.filter)
        case actionType.SET_SEARCH_KEYWORD:
            return state.set('keyword', action.keyword)
        case actionType.CLEAR_SEARCH_KEYWORD:
            return state.set('keyword', '')
        case actionType.SET_TAB:
            return state.set('currentTab', action.tabIndex)
        case actionType.SET_JOB:
            return state.set('job', action.job)
        case actionType.SELECT_SKILL:
            return state.set('currentSkill', action.skill)
        case actionType.SELECT_TREE:
            return state.set('currentTree', action.tree)
        case actionType.HOVER_NODE:
            return state.set('hoverNode', action.node)
        case actionType.SET_LOADING:
            return state.set('loading', action.loading)
        default:
            return state
    }
}

function character(state = fromJS({
    ap: 13,
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

function jobData(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_JOB:
        case actionType.SET_LEVEL:
        case actionType.SET_HLEVEL:
        case actionType.ADD_BUILD:
        case actionType.REPLACE_BUILDS:
        case actionType.DELETE_BUILD:
        case actionType.RENAME_BUILD:
        case actionType.SET_NODE:
        case actionType.RESET_BUILD:
        case actionType.SET_DEFAULT_BUILD:
        case actionType.SET_BUILD_LIST:
            return state.set(action.job, data(state.get(action.job, Map()), action))
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.LOAD_JOB:
            return state.merge({tree: action.tree, list: action.list})
        case actionType.SET_BUILD_LIST:
            return state.merge({buildList: fromJS(action.list)})
        case actionType.SET_LEVEL:
        case actionType.SET_HLEVEL:
        case actionType.ADD_BUILD:
        case actionType.REPLACE_BUILDS:
        case actionType.DELETE_BUILD:
        case actionType.RENAME_BUILD:
        case actionType.SET_NODE:
        case actionType.RESET_BUILD:
        case actionType.SET_DEFAULT_BUILD:
            return state.set('builds', builds(state.get('builds', List()), action))
        default:
            return state
    }
}

const defaultBuild = {
    name: '',
    level: 50,
    hLevel: 5,
    build: {},
    patch: 'BASE'
}

function builds(state = List(), action) {
    switch (action.type) {
        case actionType.REPLACE_BUILDS:
            return fromJS(action.builds)
        case actionType.SET_LEVEL:
        case actionType.SET_HLEVEL:
        case actionType.SET_PATCH:
        case actionType.RESET_BUILD:
        case actionType.SET_NODE:
        case actionType.SET_DEFAULT_BUILD:
        case actionType.RENAME_BUILD:
            return state.set(action.index, build(state.get(action.index, Map()), action))
        case actionType.ADD_BUILD:
            return state.push(fromJS(defaultBuild))
        case actionType.DELETE_BUILD:
            return state.delete(action.index)
        default:
            return state
    }
}

function build(state = Map(), action) {
    switch (action.type) {
        case actionType.RENAME_BUILD:
            return state.set('name', action.name)
        case actionType.SET_LEVEL:
            return state.set('level', action.level)
        case actionType.SET_HLEVEL:
            return state.set('hLevel', action.hLevel)
        case actionType.SET_PATCH:
            return state.set('patch', action.patch)
        case actionType.SET_NODE:
            return state.setIn([
                'build', action.tree
            ], action.node)
        case actionType.RESET_BUILD:
            return state.deleteIn(['build'])
        default:
            return state
    }
}

function ref(state = fromJS({icons: {}, names: {}, attributes: {}, subAttributes: {}, tags: {}, patchRef:{}, variables:{}}), action) {
    switch (action.type) {
        case actionType.SET_ICONS:
            return state.mergeIn(['icons'], action.icons)
        case actionType.SET_NAMES:
            return state.mergeIn(['names'], action.names)
        case actionType.SET_ATTRIBUTES:
            return state.mergeIn(['attributes'], fromJS(action.templates))
        case actionType.SET_SUBATTRIBUTES:
            return state.mergeIn(['subAttributes'], fromJS(action.conditions))
        case actionType.SET_VARIABLES:
            return state.mergeIn(['variables'], fromJS(action.variables))
        case actionType.SET_TAGS:
            return state.mergeIn(['tags'], fromJS(action.tags))
        case actionType.SET_PATCH_REF:
            return state.mergeIn(['patchRef'], fromJS(action.patches))
        default:
            return state
    }
}

const trainer = combineReducers({ui, character, jobData, ref})

export default trainer
