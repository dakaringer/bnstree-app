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
    buildSelector,
    buildFormatSelector,
    skillNamesSelector,
    refSelector
} from './selectors'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

const setClass = makeActionCreator(actionType.SKILL_UI_SET_CLASS, 'classCode')
const setView = makeActionCreator(actionType.SKILL_UI_SET_VIEW, 'viewType', 'value')
export const setFilter = makeActionCreator(actionType.SKILL_UI_SET_FILTER, 'filter')
export const setSearch = makeActionCreator(actionType.SKILL_UI_SET_SEARCH, 'search')
export const setPatch = makeActionCreator(actionType.SKILL_UI_SET_PATCH, 'patch')

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
    'classData',
    'groupData',
    'skillData',
    'patchData'
)
const setBuildList = makeActionCreator(actionType.SKILL_DATA_SET_BUILD_LIST, 'classCode', 'list')
//const setUserBuilds = makeActionCreator(actionType.SKILL_DATA_SET_USER_BUILDS, 'classCode', 'list')

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

const setNames = makeActionCreator(actionType.SKILL_REF_SET_NAMES, 'language', 'nameData')

export function loadClass(classCode, buildCode, buildLink) {
    return (dispatch, getState) => {
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        dispatch(setSearch(''))
        document.title = `${i18n.t(`general:${classCode}`)} | BnSTree`
        if (!dataSelector(getState()).has(classCode)) {
            dispatch(setLoading(true))
            fetch(`https://api.bnstree.com/skills/${classCode}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 0 || !json.classData) {
                        return
                    }

                    let elements = json.classData.elements
                    dispatch(
                        setClassData(
                            classCode,
                            elements,
                            flatten(json.groupData),
                            flatten(json.skillData),
                            flatten(json.patchData)
                        )
                    )
                    dispatch(setBuildElement(classCode, elements[0].element))
                    dispatch(setView('mode', json.view.mode))
                    dispatch(setView('order', json.view.order))
                    dispatch(setView('visibility', json.view.visibility))

                    if (buildCode) {
                        let currentElement = elements[buildCode[0]].element
                        let buildString = buildCode.substring(1)
                        dispatch(setBuildElement(classCode, currentElement.element))
                        currentElement.buildFormat.forEach((id, i) => {
                            if (buildString[i]) {
                                let trait = (buildString[i] - 1).toString()
                                if (trait > 2) {
                                    trait = trait - 3 + '-hm'
                                }
                                dispatch(learnMove(id, trait))
                            }
                        })
                    } else if (buildLink) {
                        fetch(`https://api.bnstree.com/skill-builds/${buildLink}`, {
                            method: 'get',
                            credentials: 'include'
                        })
                            .then(response => response.json())
                            .then(json => {
                                if (json.success === 1 && json.build) {
                                    dispatch(setBuildElement(classCode, json.build.element))
                                    for (let id in json.build.build) {
                                        dispatch(learnMove(id, json.build.build[id]))
                                    }
                                    message.success(i18n.t('general:buildLoadSuccess', 2))
                                }
                            })
                    }
                })
                .then(() => dispatch(setLoading(false)))
        }
    }
}

export function loadBuildList(classCode, page, element = null, type = null) {
    return dispatch => {
        let url = `https://api.bnstree.com/skill-builds?classCode=${classCode}&page=${page}&limit=10`
        if (element) {
            url += `&element=${element}`
        }
        if (type) {
            url += `&type=${type}`
        }

        fetch(url, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    dispatch(setBuildList(classCode, json.result))
                }
            })
    }
}

export function loadTextData(lang) {
    return (dispatch, getState) => {
        if (skillNamesSelector(getState()).equals(Map())) {
            fetch(`https://api.bnstree.com/skills/names?lang=${lang}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 1) {
                        dispatch(setNames(json.lang, flatten(json.skillNames)))
                    }
                })

            if (lang !== 'en' && !refSelector(getState()).hasIn(['skillNames', 'en'])) {
                fetch('https://api.bnstree.com/skills/names?lang=en', {
                    method: 'get',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.success === 1) {
                            dispatch(setNames('en', flatten(json.skillNames)))
                        }
                    })
            }
        }
    }
}

export function postBuild(title, type) {
    return (dispatch, getState) => {
        let element = buildElementSelector(getState())
        let classCode = classSelector(getState())
        let build = buildSelector(getState())

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

        fetch('https://api.bnstree.com/skill-builds', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify(buildDoc)
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    window.history.replaceState(null, null, `${json.link}`)

                    loadBuildList(classCode, 1)
                    message.success(i18n.t('general:buildPostSuccess', 2))
                } else {
                    message.danger(i18n.t('general:buildPostFail', 2))
                }
            })
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
        let classCode = classSelector(getState())
        let element = buildElementSelector(getState())

        dispatch(setBuildSkill(classCode, element, skill, move))
    }
}
