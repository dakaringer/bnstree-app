import { browserHistory } from 'react-router'
import {Map} from 'immutable'

import {message} from 'antd'

import * as actionType from './actionTypes'
import {pair, flatten, makeActionCreator} from '../shared/actionHelpers'
import {
    classSelector,
    buildListSelector,
    tabSelector,
    currentTabSelector,
    classElementSelector,
    currentElementSelector,
    visibilitySelector,
    buildFormatSelector,
    uiTextSelector
} from './selector'

import {setLoading} from '../../actions'

//Other constants
export const viewModes = {
    SHOW_LIST: 'SHOW_LIST',
    SHOW_GRID: 'SHOW_GRID'
}

export const visibility = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_TRAINABLE: 'SHOW_TRAINABLE'
}

export const order = {
    LEVEL: 'LEVEL',
    HOTKEY: 'HOTKEY',
    ALPHA: 'ALPHA'
}

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
const setClass = makeActionCreator(actionType.SET_CLASS, 'classCode')
const setMode = makeActionCreator(actionType.SET_VIEW_MODE, 'mode')
const setVisibility = makeActionCreator(actionType.SET_VISIBILITY, 'visibility')
export const setFilter = makeActionCreator(actionType.SET_FILTER, 'filter')
const setOrder = makeActionCreator(actionType.SET_ORDER, 'order')
export const setSearchKeyword = makeActionCreator(actionType.SET_SEARCH_KEYWORD, 'keyword')
export const setTab = makeActionCreator(actionType.SET_TAB, 'tabIndex')
export const setPatch = makeActionCreator(actionType.SET_PATCH, 'patch')

const setStatValue = makeActionCreator(actionType.SET_STAT, 'value', 'stat')
const setElementValue = makeActionCreator(actionType.SET_ELEMENT, 'value', 'element')
/*
export const setWeapon = makeActionCreator(actionType.SET_WEAPON, 'weapon')
export const setBracelet = makeActionCreator(actionType.SET_BRACELET, 'bracelet')
export const setBadge = makeActionCreator(actionType.SET_BADGE, 'badge')
export const setAmulet = makeActionCreator(actionType.SET_AMULET, 'amulet')
export const setSoulShield = makeActionCreator(actionType.SET_SOULSHIELD, 'soulshield')
*/

const loadClassData = makeActionCreator(actionType.LOAD_CLASS, 'classCode', 'elements', 'skills')
const setBuildCatalog = makeActionCreator(actionType.SET_BUILD_CATALOG, 'classCode', 'list')

const addBuild = makeActionCreator(actionType.ADD_BUILD, 'classCode', 'defaultElement')
const deleteBuild = makeActionCreator(actionType.DELETE_BUILD, 'classCode', 'index')
const loadBuild = makeActionCreator(actionType.LOAD_BUILD, 'classCode', 'index', 'element', 'build')
const renameBuild = makeActionCreator(actionType.RENAME_BUILD, 'classCode', 'index', 'name')
export const setBuildElement = makeActionCreator(actionType.SET_BUILD_ELEMENT, 'classCode', 'index', 'element')
const setType = makeActionCreator(actionType.SET_TYPE, 'classCode', 'index', 'element', 'skill', 't')
const resetBuildAction = makeActionCreator(actionType.RESET_BUILD, 'classCode', 'index')

const setIcons = makeActionCreator(actionType.SET_ICONS, 'icons')
const setSkillNames = makeActionCreator(actionType.SET_SKILL_NAMES, 'names')
const setTemplates = makeActionCreator(actionType.SET_TEMPLATES, 'templates')
const setConstants = makeActionCreator(actionType.SET_CONSTANTS, 'constants')
const setTags = makeActionCreator(actionType.SET_TAGS, 'tags')
const setPatchRef = makeActionCreator(actionType.SET_PATCH_REF, 'patches')

export function loadClass(classCode, buildCode, buildLink) {
    return (dispatch, getState) => {
        dispatch(setLoading(true))
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        if (!getState().hasIn(['trainer', 'classData', classCode, 'tree'])) {
            fetch('/api/trainer2/getClassData', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({classCode: classCode})
            }).then(response => response.json()).then(json => {
                if (!json.classData) {
                    browserHistory.push('/404')
                    return
                }
                document.title = `${uiTextSelector(getState()).getIn(['CLASS_NAMES', classCode])} | BnSTree`

                let elements = json.classData.elements
                dispatch(loadClassData(classCode, elements, flatten(json.skillList)))
                dispatch(setMode(json.mode))
                dispatch(setOrder(json.order))

                let index = buildListSelector(getState()).size - 1
                if (index < 0) {
                    dispatch(addBuild(classCode, elements[0].element))
                }

                if (buildCode) {
                    let currentElement = elements[buildCode[0]]
                    let buildString = buildCode.substring(1)
                    dispatch(setBuildElement(classCode, 0, currentElement.element))
                    currentElement.buildFormat.forEach((id, i) => {
                        let trait = (buildString[i] - 1).toString()
                        if (trait > 2) {
                            trait = (trait - 3) + '-hm'
                        }
                        dispatch(learnType(id, trait))
                    })
                }
                else if (buildLink) {
                    fetch('/api/trainer2/loadBuild', {
                        method: 'post',
                        credentials: 'include',
                        headers: postHeaders,
                        body: JSON.stringify({link: buildLink, classCode: classCode})
                    }).then(response => response.json()).then(json => {
                        if (json.build) {
                            if (index >= 0) {
                                dispatch(addBuild(classCode, elements[0].element))
                            }
                            index = index + 1
                            dispatch(setBuildElement(classCode, index, json.build.element))
                            dispatch(loadBuild(classCode, index, json.build.element, json.build.build))
                            dispatch(renameBuild(classCode, index, json.build.title))
                            dispatch(setTab(index))

                            let uiText = uiTextSelector(getState()).get('BUILD_LIST', Map())
                            message.success(uiText.get('success', ''), 2)
                        }
                    })
                }
                dispatch(setLoading(false))
            })
        } else {
            dispatch(setLoading(false))
        }
    }
}

export function loadBuildCatalog(classCode, page, element=null, type=null) {
    return (dispatch) => {
        fetch('/api/trainer2/loadBuildList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({classCode: classCode, page: page, element: element, type: type})
        }).then(response => response.json()).then(json => {
            dispatch(setBuildCatalog(classCode, json))
        })
    }
}

export function loadTextData(lang) {
    return (dispatch) => {
        fetch('/api/trainer2/getTextData', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({lang: lang})
        }).then(response => response.json()).then(json => {
            dispatch(setTemplates(pair(json.templates, 'template')))
            dispatch(setIcons(pair(json.ref, 'icon')))
            dispatch(setSkillNames(pair(json.ref, 'name')))
            dispatch(setTags(flatten(json.tags)))
            dispatch(setConstants(pair(json.constants, lang)))
            dispatch(setPatchRef(flatten(json.patches)))
        })
    }
}

export function setViewMode(mode) {
    return (dispatch) => {
        dispatch(setMode(mode))

        fetch('/api/trainer2/setMode', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({mode: mode})
        })
    }
}

export function setOrderMode(order) {
    return (dispatch) => {
        dispatch(setOrder(order))

        fetch('/api/trainer2/setOrder', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({order: order})
        })
    }
}

export function postBuild(title, type) {
    return (dispatch, getState) => {
        let element = currentElementSelector(getState())
        let build = tabSelector(getState()).getIn(['build', element], Map())
        let classCode = classSelector(getState())

        buildFormatSelector(getState()).forEach(id => {
            if (!build.has(id)) {
                build = build.set(id, '0')
            }
        })

        let buildDoc = {
            title: title,
            type: type,
            classCode: classCode,
            element: element,
            build: build
        }

        fetch('/api/trainer2/postBuild', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify(buildDoc)
        }).then(response => response.json()).then(json => {
            history.replaceState(null, null, `${json.link}`)

            fetch('/api/trainer2/loadBuildList', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({classCode: classCode, page: 1})
            }).then(response => response.json()).then(json => {
                dispatch(setBuildCatalog(classCode, json))
            })
        })
    }
}

export function toggleVisibility() {
    return (dispatch, getState) => {
        let current = visibilitySelector(getState())

        if (current === visibility.SHOW_ALL) {
            dispatch(setVisibility(visibility.SHOW_TRAINABLE))
        } else {
            dispatch(setVisibility(visibility.SHOW_ALL))
        }
    }
}

export function setStat(value, type) {
    return (dispatch) => {
        if (isNaN(value)) {
            return
        }

        if (value === '') {
            dispatch(setStatValue(null, type))
        } else {
            dispatch(setStatValue(parseInt(value), type))
        }
    }
}

export function blurStat(value, type) {
    return (dispatch) => {
        if (value === '') {
            dispatch(setStatValue(0, type))
        }
    }
}

export function setElementStat(value, type) {
    return (dispatch) => {
        if (isNaN(value)) {
            return
        }

        if (value === '') {
            dispatch(setElementValue(null, type))
        } else {
            dispatch(setElementValue(value, type))
        }
    }
}

export function blurElement(value, type) {
    return (dispatch) => {
        if (value === '') {
            dispatch(setElementValue('100.00', type))
        } else {
            dispatch(setElementValue(parseFloat(value).toFixed(2)))
        }
    }
}


export function addTab() {
    return function(dispatch, getState) {
        let classCode = classSelector(getState())
        let classElements = classElementSelector(getState())
        let newIndex = buildListSelector(getState()).size

        dispatch(addBuild(classCode, classElements.getIn([0, 'element'])))
        dispatch(setTab(newIndex))
    }
}

export function deleteTab(index) {
    return function(dispatch, getState) {
        if (buildListSelector(getState()).size === 1) {
            return
        }

        let classCode = classSelector(getState())
        dispatch(deleteBuild(classCode, index))
        let currentTab = currentTabSelector(getState())
        let newIndex = currentTab
        if (index == currentTab) {
            newIndex = buildListSelector(getState()).size - 1
        } else if (index < currentTab) {
            newIndex = currentTab - 1
        }

        dispatch(setTab(newIndex))
    }
}


export function renameTab(name) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let classCode = classSelector(getState())

        dispatch(renameBuild(classCode, tabIndex, name))
    }
}

export function toggleCurrentElement() {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let classCode = classSelector(getState())
        let classElements = classElementSelector(getState())
        let currentElement = currentElementSelector(getState())

        let otherElement = classElements.getIn([0, 'element']) === currentElement ? classElements.getIn([1, 'element']) : classElements.getIn([0, 'element'])

        dispatch(setFilter('ALL'))

        dispatch(setBuildElement(classCode, tabIndex, otherElement))
    }
}
export function learnType(skill, type) {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        let tabIndex = currentTabSelector(getState())
        let buildElement = currentElementSelector(getState())

        dispatch(setType(classCode, tabIndex, buildElement, skill, type))
    }
}

export function applyBuild(build) {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        let tabIndex = currentTabSelector(getState())

        dispatch(setBuildElement(classCode, tabIndex, build.get('element')))
        dispatch(loadBuild(classCode, tabIndex, build.get('element'), build.get('build', Map())))
    }
}

export function resetBuild() {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        let tabIndex = currentTabSelector(getState())

        dispatch(resetBuildAction(classCode, tabIndex))
    }
}
