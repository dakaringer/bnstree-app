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

export function loadClass(classCode, buildCode, buildId) {
    return (dispatch, getState) => {
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        dispatch(setSearch(''))
        document.title = `${i18n.t(`general:${classCode}`)} - ${i18n.t('general:skills')} | BnSTree`
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

export function loadBuildList(page = 1, classCode = null, element = null, type = null) {
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
                    loadBuildList(classCode, 1)
                    message.success(i18n.t('general:postSuccess'))
                } else {
                    message.danger(i18n.t('general:postFail'))
                }
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
        let classCode = classSelector(getState())
        let element = buildElementSelector(getState())

        dispatch(setBuildSkill(classCode, element, skill, move))
    }
}
