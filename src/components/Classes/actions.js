import * as actionType from './actionTypes'
import {Map} from 'immutable'
import i18n from '../../i18n'
import {message} from 'antd'

import {makeActionCreator, flatten} from '../../helpers'
import {setLoading} from '../../actions'
import {
    dataSelector,
    classSelector,
    buildElementSelector,
    elementDataSelector,
    skillNamesSelector,
    buildSelector,
    refSelector,
    characterModeSelector
} from './selectors'
import {userSelector} from '../../selectors'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

export const setClass = makeActionCreator(actionType.SKILL_UI_SET_CLASS, 'classCode')
const setView = makeActionCreator(actionType.SKILL_UI_SET_VIEW, 'viewType', 'value')
export const setFilter = makeActionCreator(actionType.SKILL_UI_SET_FILTER, 'filter')
export const setSearch = makeActionCreator(actionType.SKILL_UI_SET_SEARCH, 'search')
export const setPatch = makeActionCreator(actionType.SKILL_UI_SET_PATCH, 'patch')
export const setCharacterMode = makeActionCreator(actionType.SKILL_UI_SET_CHARACTER_MODE, 'mode')

export const setStat = makeActionCreator(actionType.SKILL_CHAR_SET_STAT, 'stat', 'value')
export const setElementDmg = makeActionCreator(
    actionType.SKILL_CHAR_SET_ELEMENT_DMG,
    'element',
    'value'
)
export const setEquip = makeActionCreator(actionType.SKILL_CHAR_SET_EQUIP, 'equipType', 'item')

export const setClassData = makeActionCreator(
    actionType.SKILL_DATA_SET_CLASS_DATA,
    'classCode',
    'data'
)
const setBuildList = makeActionCreator(actionType.SKILL_DATA_SET_BUILD_LIST, 'classCode', 'list')
const setUserBuildList = makeActionCreator(
    actionType.SKILL_DATA_SET_USER_BUILD_LIST,
    'classCode',
    'list'
)

const setBuildElement = makeActionCreator(
    actionType.SKILL_BUILD_SET_ELEMENT,
    'classCode',
    'element'
)
const setBuildSkill = makeActionCreator(
    actionType.SKILL_BUILD_SET_SKILL,
    'classCode',
    'element',
    'skill',
    'move'
)

const setSkillNames = makeActionCreator(
    actionType.SKILL_REF_SET_SKILL_NAMES,
    'language',
    'nameData'
)
const setItemNames = makeActionCreator(actionType.SKILL_REF_SET_ITEM_NAMES, 'language', 'nameData')

export function loadClass(classCode, buildCode, buildId) {
    return (dispatch, getState) => {
        dispatch(setCharacterMode(false))
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        dispatch(setSearch(''))
        if (!dataSelector(getState()).has(classCode)) {
            dispatch(setLoading(true))

            dispatch(loadBuildList(1, classCode))
            if (userSelector(getState())) {
                dispatch(loadBuildList(1, classCode, null, null, true))
            }

            dispatch(loadBadges())
            dispatch(loadSoulshields())

            fetch(`https://api.bnstree.com/classes/${classCode}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 0 || !json.data) {
                        return
                    }
                    let elements = json.data.classData.elements

                    let data = json.data
                    Object.keys(data).forEach(k => {
                        if (k !== 'classData') {
                            data[k] = flatten(data[k])
                        }
                    })
                    data.classData = elements

                    dispatch(setClassData(classCode, data))
                    dispatch(setBuildElement(classCode, elements[0].element))
                    dispatch(setView('mode', json.view.mode))
                    dispatch(setView('order', json.view.order))
                    dispatch(setView('visibility', json.view.visibility))

                    if (buildCode || buildId) {
                        dispatch(loadBuild(buildCode, buildId))
                    }
                })
                .then(() => dispatch(setLoading(false)))
        }
    }
}

export function loadTextData(lang) {
    return (dispatch, getState) => {
        if (skillNamesSelector(getState()).equals(Map())) {
            fetch(`https://api.bnstree.com/classes/names?lang=${lang}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 1) {
                        dispatch(setSkillNames(json.lang, flatten(json.skillNames)))
                        dispatch(setItemNames(json.lang, flatten(json.itemNames)))
                    }
                })

            if (lang !== 'en' && !refSelector(getState()).hasIn(['skillNames', 'en'])) {
                fetch('https://api.bnstree.com/classes/names?lang=en', {
                    method: 'get',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.success === 1) {
                            dispatch(setSkillNames('en', flatten(json.skillNames)))
                            dispatch(setItemNames('en', flatten(json.itemNames)))
                        }
                    })
            }
        }
    }
}

export function loadBuildList(
    page = 1,
    classCode = null,
    element = null,
    type = null,
    user = null
) {
    return dispatch => {
        let url = `https://api.bnstree.com/skill-builds?page=${page}&limit=10`
        if (classCode) {
            url += `&classCode=${classCode}`
        }
        if (element) {
            url += `&element=${element}`
        }
        if (type) {
            url += `&type=${type}`
        }
        if (user) {
            url += '&user=true'
        }

        fetch(url, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    if (user) {
                        dispatch(setUserBuildList(classCode, json.result))
                    } else {
                        dispatch(setBuildList(classCode, json.result))
                    }
                }
            })
    }
}

export function postBuild(title, type) {
    return (dispatch, getState) => {
        let element = buildElementSelector(getState())
        let classElements = elementDataSelector(getState())
        let elementIndex = classElements.findIndex(a => a.get('element') === element)

        let classCode = classSelector(getState())
        let build = buildSelector(getState())

        let buildObjects = []
        classElements.getIn([elementIndex, 'buildFormat'], Map()).forEach(id => {
            buildObjects.push({
                id: id,
                trait: build.get(id, 1)
            })
        })

        let buildDoc = {
            title: title,
            type: type,
            classCode: classCode,
            element: element,
            buildObjects: buildObjects
        }

        fetch('https://api.bnstree.com/skill-builds', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify(buildDoc)
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    dispatch(loadBuildList(1, classCode))
                    dispatch(loadBuildList(1, classCode, null, null, true))
                    message.success(i18n.t('general:postSuccess'))
                } else {
                    message.error(i18n.t('general:fail'))
                }
            })
    }
}

export function deleteBuild(id, classCode) {
    return dispatch => {
        fetch('https://api.bnstree.com/skill-builds', {
            method: 'delete',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({id: id})
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1 && json.result.n === 1) {
                    message.success(i18n.t('general:deleteSuccess'))
                } else {
                    message.error(i18n.t('general:fail'))
                }
                dispatch(loadBuildList(1, classCode))
                dispatch(loadBuildList(1, classCode, null, null, true))
            })
    }
}

export function loadBuild(buildCode, buildId) {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())

        dispatch(updateView('visibility', 'TRAINABLE'))
        if (buildId) {
            fetch(`https://api.bnstree.com/skill-builds/${buildId}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (
                        json.success === 1 &&
                        json.build &&
                        classCode === json.build.classCode &&
                        json.build.buildObjects
                    ) {
                        json.build.buildObjects.forEach(skill => {
                            dispatch(learnMove(skill.id, skill.trait))
                        })

                        message.success(i18n.t('skills:buildLoaded'))
                    }
                })
        } else {
            let currentElement = elementDataSelector(getState()).get(buildCode[0])
            let buildString = buildCode.substring(1)
            dispatch(setBuildElement(classCode, currentElement.get('element')))
            currentElement.get('buildFormat', Map()).forEach((id, i) => {
                if (buildString[i]) {
                    let trait = parseInt(buildString[i], 10)
                    dispatch(learnMove(id, trait))
                }
            })
        }
    }
}

export function updateView(type, value) {
    return dispatch => {
        dispatch(setView(type, value))
        let obj = {}
        obj[type] = value
        fetch('https://api.bnstree.com/user/view', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify(obj)
        })
    }
}

export function toggleElement() {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        let classElements = elementDataSelector(getState())
        let currentElement = buildElementSelector(getState())

        let otherElement =
            classElements.getIn([0, 'element']) === currentElement
                ? classElements.getIn([1, 'element'])
                : classElements.getIn([0, 'element'])

        dispatch(setFilter('ALL'))
        dispatch(setBuildElement(classCode, otherElement))
    }
}

export function learnMove(skill, move) {
    return (dispatch, getState) => {
        if (!characterModeSelector(getState())) {
            let classCode = classSelector(getState())
            let element = buildElementSelector(getState())

            dispatch(setBuildSkill(classCode, element, skill, move))
        }
    }
}

function loadBadges() {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        dispatch(loadUserVotes())
        fetch(`https://api.bnstree.com/items/badges/${classCode}`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    let data = json.data
                    Object.keys(data).forEach(k => {
                        data[k] = flatten(data[k])
                    })
                    dispatch(setClassData(classCode, data))
                }
            })
    }
}

function loadUserVotes() {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        fetch(`https://api.bnstree.com/items/vote/${classCode}`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    dispatch(setClassData(classCode, {userBadgeVoteData: json.data}))
                }
            })
    }
}

function loadSoulshields() {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        dispatch(loadUserVotes())
        fetch(`https://api.bnstree.com/items/soulshields/${classCode}`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    let data = json.data
                    Object.keys(data).forEach(k => {
                        data[k] = flatten(data[k])
                    })
                    dispatch(setClassData(classCode, data))
                }
            })
    }
}
