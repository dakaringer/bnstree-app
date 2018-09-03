import { browserHistory } from 'react-router'

import * as actionType from './actionTypes'
import {pair, flatten, makeActionCreator} from '../shared/actionHelpers'
import {calculateMaxPoints, calculateUsedPoints} from './calc'
import {
    jobSelector,
    buildsSelector,
    buildSelector,
    treeDataSelector,
    currentTabSelector,
    levelSelector,
    firstListIdSelector,
    rawListDataSelector,
    currentTreeSelector,
    visibilitySelector,
    rawNodesSelector,
    //tabSelector
} from './selector'

//Other constants
export const viewModes = {
    SHOW_LIST: 'SHOW_LIST',
    SHOW_GRID: 'SHOW_GRID'
}

export const visibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_TRAINABLE: 'SHOW_TRAINABLE'
}

const prefixes = {
    BM: '20',
    KF: '21',
    FM: '22',
    DE: '24',
    AS: '25',
    SU: '26',
    BD: '27',
    WL: '28',
    SF: '(30|35)'
}

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
const setLoading = makeActionCreator(actionType.SET_LOADING, 'loading')

const loadJob = makeActionCreator(actionType.LOAD_JOB, 'job', 'tree', 'list')
const setAttb = makeActionCreator(actionType.SET_ATTRIBUTES, 'templates')
const setSubAttb = makeActionCreator(actionType.SET_SUBATTRIBUTES, 'conditions')
const setTags = makeActionCreator(actionType.SET_TAGS, 'tags')
const setVariables = makeActionCreator(actionType.SET_VARIABLES, 'variables')
const setNames = makeActionCreator(actionType.SET_NAMES, 'names')
const setIcons = makeActionCreator(actionType.SET_ICONS, 'icons')
const setJob = makeActionCreator(actionType.SET_JOB, 'job')
const setBuildList = makeActionCreator(actionType.SET_BUILD_LIST, 'job', 'list')
const addBuild = makeActionCreator(actionType.ADD_BUILD, 'job')
export const replaceBuilds = makeActionCreator(actionType.REPLACE_BUILDS, 'job', 'builds')
const setPatchNames = makeActionCreator(actionType.SET_PATCH_REF, 'patches')

export function loadClass(job, buildLink) {
    return (dispatch, getState) => {
        dispatch(setLoading(true))
        if (!getState().hasIn(['trainer', 'jobData', job, 'tree'])) {
            fetch('/api/trainer/getClassData', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({jobCode: prefixes[job]})
            }).then(response => response.json()).then(json => {
                if (json.list.length == 0) {
                    browserHistory.push('/404')
                    return
                }
                dispatch(loadJob(job, flatten(json.tree), flatten(json.list)))
                dispatch(setMode(json.mode))

                dispatch(selectSkill(firstListIdSelector(getState())))

                if (buildLink) {
                    fetch('/api/trainer/loadBuild', {
                        method: 'post',
                        credentials: 'include',
                        headers: postHeaders,
                        body: JSON.stringify({link: buildLink, job: job})
                    }).then(response => response.json()).then(json => {
                        if (json.builds) {
                            dispatch(replaceBuilds(job, json.builds))
                        }
                        else {
                            dispatch(addBuild(job))
                        }
                    })
                }
                else {
                    dispatch(addBuild(job))
                }
                dispatch(setLoading(false))
            })
            dispatch(setJob(job))
        } else {
            dispatch(setLoading(false))
            dispatch(setJob(job))
            dispatch(selectSkill(firstListIdSelector(getState())))
        }
    }
}

export function loadBuildList(job, page) {
    return (dispatch) => {
        fetch('/api/trainer/loadBuildList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({job: job, limit: 10, page: page})
        }).then(response => response.json()).then(json => {
            dispatch(setBuildList(job, json))
        })
    }
}

export function loadTextData(lang) {
    return (dispatch) => {
        fetch('/api/trainer/getTextData', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({lang: lang})
        }).then(response => response.json()).then(json => {
            dispatch(setAttb(pair(json.attb, 'template')))
            dispatch(setIcons(pair(json.ref, 'icon')))
            dispatch(setNames(pair(json.ref, 'name')))
            dispatch(setSubAttb(flatten(json.subAttb)))
            dispatch(setTags(flatten(json.tags)))
            dispatch(setVariables(pair(json.variables, lang)))
            dispatch(setPatchNames(flatten(json.patchNames)))
        })
    }
}

const setLevel = makeActionCreator(actionType.SET_LEVEL, 'job', 'index', 'level')
const setHLevel = makeActionCreator(actionType.SET_HLEVEL, 'job', 'index', 'hLevel')

export function setLevels(lv) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())

        let currentLevels = levelSelector(getState())
        let hLv = currentLevels.hLevel

        if (currentLevels.level != lv) {
            hLv = lv != 50
                ? 0
                : 1
            dispatch(setHLevel(job, tabIndex, hLv))
        }
        dispatch(setLevel(job, tabIndex, lv))

        let jobTree = treeDataSelector(getState())
        let build = buildSelector(getState())
        if (calculateMaxPoints(lv, hLv) < calculateUsedPoints(jobTree, build)) {
            dispatch(resetBuildAction(job, tabIndex))
        }
    }
}

export function setHLevels(hLv) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())

        dispatch(setHLevel(job, tabIndex, hLv))

        let lv = levelSelector(getState()).level
        let jobTree = treeDataSelector(getState())
        let build = buildSelector(getState())
        if (calculateMaxPoints(lv, hLv) < calculateUsedPoints(jobTree, build)) {
            dispatch(resetBuildAction(job, tabIndex))
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
export function formatStat(value, type) {
    return (dispatch) => {
        if (value === '') {
            dispatch(setStatValue(0, type))
        }
    }
}
const setStatValue = makeActionCreator(actionType.SET_STAT, 'value', 'stat')

export function setElement(value, type) {
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
export function formatElement(value, type) {
    return (dispatch) => {
        if (value === '') {
            dispatch(setElementValue('100.00', type))
        } else {
            dispatch(setElementValue(parseFloat(value).toFixed(2)))
        }
    }
}
const setElementValue = makeActionCreator(actionType.SET_ELEMENT, 'value', 'element')

export const setMode = makeActionCreator(actionType.SET_VIEW_MODE, 'mode')
export function setViewMode(mode) {
    return (dispatch) => {
        dispatch(setMode(mode))

        fetch('/api/trainer/setMode', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({mode: mode})
        })
    }
}

export const setSearchKeyword = makeActionCreator(actionType.SET_SEARCH_KEYWORD, 'keyword')
export const clearSearchKeyword = makeActionCreator(actionType.CLEAR_SEARCH_KEYWORD)
const setVisibility = makeActionCreator(actionType.SET_VISIBILITY, 'filter')
export function toggleVisibility() {
    return (dispatch, getState) => {
        let current = visibilitySelector(getState())

        if (current === visibilityFilters.SHOW_ALL) {
            dispatch(setVisibility(visibilityFilters.SHOW_TRAINABLE))
        } else {
            dispatch(setVisibility(visibilityFilters.SHOW_ALL))
        }
    }
}

export function selectSkill(id) {
    return (dispatch, getState) => {
        let list = rawListDataSelector(getState())
        if (!list.has(id)) {
            return
        }

        let treeId = rawListDataSelector(getState()).getIn([id, 'treeId']) || id

        dispatch(selectSkillId(id))
        dispatch(selectTreeId(treeId))
    }
}
const selectSkillId = makeActionCreator(actionType.SELECT_SKILL, 'skill')
const selectTreeId = makeActionCreator(actionType.SELECT_TREE, 'tree')

export const setPatch = makeActionCreator(actionType.SET_PATCH, 'patch')

export function addTab() {
    return function(dispatch, getState) {
        if (buildsSelector(getState()).size === 5) {
            return
        }
        let job = jobSelector(getState())
        dispatch(addBuild(job))
        let newIndex = buildsSelector(getState()).size - 1
        dispatch(setTab(newIndex))
    }
}

export function deleteTab(index) {
    return function(dispatch, getState) {
        if (buildsSelector(getState()).size === 1) {
            return
        }

        let job = jobSelector(getState())
        dispatch(deleteBuild(job, index))
        let currentTab = currentTabSelector(getState())
        let newIndex = currentTab
        if (index == currentTab) {
            newIndex = buildsSelector(getState()).size - 1
        } else if (index < currentTab) {
            newIndex = currentTab - 1
        }

        dispatch(setTab(newIndex))
    }
}

const deleteBuild = makeActionCreator(actionType.DELETE_BUILD, 'job', 'index')

export function renameTab(name) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())

        dispatch(renameBuild(job, tabIndex, name))
    }
}
const renameBuild = makeActionCreator(actionType.RENAME_BUILD, 'job', 'index', 'name')

export const setWeapon = makeActionCreator(actionType.SET_WEAPON, 'weapon')
export const setBracelet = makeActionCreator(actionType.SET_BRACELET, 'bracelet')
export const setBadge = makeActionCreator(actionType.SET_BADGE, 'badge')
export const setAmulet = makeActionCreator(actionType.SET_AMULET, 'amulet')
export const setSoulShield = makeActionCreator(actionType.SET_SOULSHIELD, 'soulshield')

export const hoverNode = makeActionCreator(actionType.HOVER_NODE, 'node')
export const setTab = makeActionCreator(actionType.SET_TAB, 'tabIndex')

export function learnNode(node) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())

        let currentTree = currentTreeSelector(getState())

        dispatch(setNode(node, currentTree, job, tabIndex))
    }
}

export function learnTreeNode(tree, node) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())

        dispatch(setNode(node, tree, job, tabIndex))
    }
}

export function unlearnNode(node) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())
        let currentTree = currentTreeSelector(getState())
        let treeData = rawNodesSelector(getState())

        let newNode = treeData.getIn([
            node, 'parent'
        ], null)

        dispatch(setNode(newNode, currentTree, job, tabIndex))
    }
}

export function unlearnTreeNode(tree, node) {
    return (dispatch, getState) => {
        let tabIndex = currentTabSelector(getState())
        let job = jobSelector(getState())
        let treeData = rawNodesSelector(getState())

        let newNode = treeData.getIn([
            node, 'parent'
        ], null)

        dispatch(setNode(newNode, tree, job, tabIndex))
    }
}

export function resetBuild() {
    return (dispatch, getState) => {
        let job = jobSelector(getState())
        let tabIndex = currentTabSelector(getState())

        dispatch(resetBuildAction(job, tabIndex))
    }
}

/*
export function generateLink() {
    return (dispatch, getState) => {
        let tab = tabSelector(getState())
        let builds = List(tab)

        if (tab.get('build').size > 0) {
            fetch('/api/trainer/postUnlistedBuild', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({builds: builds.toJS()})
            }).then(response => response.json()).then(json => {
            })
        }
    }
}

export function parseBuild(code, job) {
    return (dispatch, getState) => {
        let jobTree = treeDataSelector(getState())

        let prefix = prefixes[job]

        let lv = parseInt(code.slice(0, 2))
        let hLv = parseInt(code.slice(2, 4))
        let patch = parseInt(code.slice(4, 10))
        let skillCode = code.slice(10)

        let build = {}

        let start = 0
        let end = 5

        while (start < skillCode.length) {
            let skillPair = skillCode.slice(start, end)
            let id = prefix + skillPair.slice(0, 3)
            let node = skillPair.slice(3)

            if (skillPair.length != 5 && !jobTree.has(id)) {
                return
            }

            build[id] = node

            start += 5
            end += 5
        }

        if (calculateMaxPoints(lv, hLv) >= calculateUsedPoints(jobTree, build)) {
            dispatch(setPatch(patch))
            dispatch(loadQuickBuild(build, lv, hLv))
        }
    }
}

const loadQuickBuild = makeActionCreator(actionType.LOAD_QUICK_BUILD, 'build', 'level', 'hLevel', 'patch')
*/

const setNode = makeActionCreator(actionType.SET_NODE, 'node', 'tree', 'job', 'index')

const resetBuildAction = makeActionCreator(actionType.RESET_BUILD, 'job', 'index')
