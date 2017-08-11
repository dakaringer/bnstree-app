import {combineReducers} from 'redux-immutable'
import {fromJS, Map} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        classCode: 'BM',
        view: {
            mode: 'LIST',
            order: 'LEVEL',
            visibility: 'ALL'
        },
        filter: 'ALL',
        search: '',
        patch: 'BASE',
        characterMode: false
    }),
    action
) {
    switch (action.type) {
        case actionType.SKILL_UI_SET_CLASS:
            return state.set('classCode', action.classCode)
        case actionType.SKILL_UI_SET_VIEW:
            return state.setIn(['view', action.viewType], action.value)
        case actionType.SKILL_UI_SET_FILTER:
            return state.set('filter', action.filter)
        case actionType.SKILL_UI_SET_SEARCH:
            return state.set('search', action.search)
        case actionType.SKILL_UI_SET_PATCH:
            return state.set('patch', action.patch)
        case actionType.SKILL_UI_SET_CHARACTER_MODE:
            return state.set('characterMode', action.mode)
        default:
            return state
    }
}

function character(
    state = fromJS({
        ap: 13,
        apPet: 5,
        ad: 0,
        c: 1,
        element: {
            flame: 100.0,
            frost: 100.0,
            lightning: 100.0,
            shadow: 100.0,
            wind: 100.0,
            earth: 100.0
        },
        equip: {
            s3: null,
            s5: null,
            s8: null,
            wep: null,
            sBadge: null,
            mBadge: null
        }
    }),
    action
) {
    switch (action.type) {
        case actionType.SKILL_CHAR_SET_STAT:
            return state.set(action.stat, action.value)
        case actionType.SKILL_CHAR_SET_ELEMENT_DMG:
            return state.setIn(['element', action.element], action.value)
        case actionType.SKILL_CHAR_SET_EQUIP:
            return state.setIn(['equip', action.equipType], action.item)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.SKILL_DATA_SET_CLASS_DATA:
        case actionType.SKILL_DATA_SET_BUILD_LIST:
        case actionType.SKILL_DATA_SET_USER_BUILD_LIST:
            return state.set(
                action.classCode,
                classData(state.get(action.classCode, Map()), action)
            )
        default:
            return state
    }
}

function classData(state = Map(), action) {
    switch (action.type) {
        case actionType.SKILL_DATA_SET_CLASS_DATA:
            return state.merge({
                classData: action.classData,
                skillData: action.skillData,
                groupData: action.groupData,
                patchData: action.patchData,
                statData: action.statData,
                buildCount: action.buildCount
            })
        case actionType.SKILL_DATA_SET_BUILD_LIST:
            return state.merge({buildList: action.list})
        case actionType.SKILL_DATA_SET_USER_BUILD_LIST:
            return state.merge({userBuildList: action.list})
        default:
            return state
    }
}

function build(state = Map(), action) {
    switch (action.type) {
        case actionType.SKILL_BUILD_SET_ELEMENT:
            return state.setIn([action.classCode, 'element'], action.element)
        case actionType.SKILL_BUILD_SET_SKILL:
            return state.setIn(
                [action.classCode, 'build', action.element, action.skill],
                action.move
            )
        default:
            return state
    }
}

function ref(state = fromJS({skillNames: {}}), action) {
    switch (action.type) {
        case actionType.SKILL_REF_SET_NAMES:
            return state.mergeDeepIn(['skillNames', action.language], action.nameData)
        default:
            return state
    }
}

export default combineReducers({ui, character, data, build, ref})
