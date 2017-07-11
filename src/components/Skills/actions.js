import * as actionType from './actionTypes'
import i18n from './i18n'
import {browserHistory} from 'react-router'
import {makeActionCreator, flatten} from '../../helpers'
import {setLoading, setUIText} from '../../actions'
import {
    uiClassSelector,
    currentElementSelector,
    classElementSelector,
    buildSelector,
    buildFormatSelector
} from './selectors'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

const setClass = makeActionCreator(actionType.SKILL_UI_SET_CLASS, 'classCode')
const setView = makeActionCreator(actionType.SKILL_UI_SET_VIEW, 'type', 'value')
export const setFilter = makeActionCreator(actionType.SKILL_UI_SET_FILTER, 'filter')
export const setSearch = makeActionCreator(actionType.SKILL_UI_SET_SEARCH, 'search')
export const setPatch = makeActionCreator(actionType.SKILL_UI_SET_PATCH, 'patch')

export const setStat = makeActionCreator(actionType.SKILL_CHAR_SET_STAT, 'stat', 'value')
export const setElementDmg = makeActionCreator(actionType.SKILL_CHAR_SET_ELEMENT_DMG, 'element', 'value')
export const setEquip = makeActionCreator(actionType.SKILL_CHAR_SET_EQUIP, 'type', 'item')

const setClassData = makeActionCreator(actionType.SKILL_DATA_SET_CLASS_DATA, 'classCode', 'classData', 'groupData', 'skillData', 'patchData')
const setBuildList = makeActionCreator(actionType.SKILL_DATA_SET_BUILD_LIST, 'classCode', 'list')
const setUserBuilds = makeActionCreator(actionType.SKILL_DATA_SET_USER_BUILDS, 'classCode', 'list')

const setBuildElement = makeActionCreator(actionType.SKILL_BUILD_SET_ELEMENT, 'classCode', 'element')
const setBuildSkill = makeActionCreator(actionType.SKILL_BUILD_SET_SKILL, 'classCode', 'element', 'skill', 'move')

const setNames = makeActionCreator(actionType.SKILL_REF_SET_NAMES, 'nameData')

export function loadClass(classCode, buildCode, buildLink) {
    return (dispatch, getState) => {
        dispatch(setLoading(true))
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        if (!getState().hasIn(['trainer', 'classData', classCode])) {
            fetch(`https://api.bnstree.com/skills/${classCode}`, {
                method: 'get',
                credentials: 'include'
            }).then(response => response.json()).then(json => {
                if (json.success === 0) {
                    browserHistory.push('/404')
                    return
                }
                document.title = `${i18n.t(`general:${classCode}`)} | BnSTree`

                let elements = json.classData.elements
                dispatch(loadClassData(classCode, json.classData, flatten(json.groupData), flatten(json.skillData), flatten(json.patchData)))
                dispatch(setBuildElement(classCode, elements[0]))
                dispatch(setView('mode', json.view.mode))
                dispatch(setView('order', json.view.order))
                dispatch(setView('visibility', json.view.visibility))

                if (buildCode) {
                    let currentElement = elements[buildCode[0]]
                    let buildString = buildCode.substring(1)
                    dispatch(setBuildElement(classCode, currentElement.element))
                    currentElement.buildFormat.forEach((id, i) => {
                        if (buildString[i]) {
                            let trait = (buildString[i] - 1).toString()
                            if (trait > 2) {
                                trait = (trait - 3) + '-hm'
                            }
                            dispatch(learnMove(id, trait))
                        }
                    })
                    dispatch(setLoading(false))
                }
                else if (buildLink) {
                    fetch(`https://api.bnstree.com/skill-builds/${buildLink}`, {
                        method: 'get',
                        credentials: 'include'
                    }).then(response => response.json()).then(json => {
                        if (json.success === 1 && json.build) {
                            dispatch(setBuildElement(classCode, json.build.element))
                            for (id of json.build.build) {
                                dispatch(learnMove(id, json.build.build[id]))
                            }
                            message.success(i18n.t('general:buildLoadSuccess', 2)
                        }
                        dispatch(setLoading(false))
                    })
                }
                else {
                    dispatch(setLoading(false))
                }
            })
        } else {
            dispatch(setLoading(false))
        }
    }
}

export function loadBuildList(classCode, page, element=null, type=null) {
    return (dispatch) => {
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
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setBuildList(classCode, json.result))
            }
        })
    }
}

export function loadTextData(lang) {
    return (dispatch) => {
        fetch(`https://api.bnstree.com/languages/skill/${lang}`, {
            method: 'get',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setUIText(json.lang, 'skill', json.languages))
                i18n.addResourceBundle(json.lang, 'skill', json.languages, true)
            }
        })

        fetch(`https://api.bnstree.com/languages/tooltip/${lang}`, {
            method: 'get',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setUIText(json.lang, 'tooltip', json.languages))
                i18n.addResourceBundle(json.lang, 'tooltip', json.languages, true)
            }
        })

        fetch('https://api.bnstree.com/skills/names', {
            method: 'get',
            credentials: 'include'
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                dispatch(setNames(flatten(json.skillNames)))
            }
        })
    }
}

export function postBuild(title, type) {
    return (dispatch, getState) => {
        let element = currentElementSelector(getState())
        let classCode = uiClassSelector(getState())
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
        }).then(response => response.json()).then(json => {
            if (json.success === 1) {
                history.replaceState(null, null, `${json.link}`)

                loadBuildList(classCode, 1)
                message.success(i18n.t('general:buildPostSuccess', 2)
            }
            else {
                message.danger(i18n.t('general:buildPostFail', 2)
            }
        })
    }
}

export function updateView(type, value) {
    return (dispatch) => {
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
        let classCode = uiClassSelector(getState())
        let classElements = classElementSelector(getState())
        let currentElement = currentElementSelector(getState())

        let otherElement = classElements.getIn([0, 'element']) === currentElement ? classElements.getIn([1, 'element']) : classElements.getIn([0, 'element'])

        dispatch(setFilter('ALL'))
        dispatch(setBuildElement(classCode, otherElement))
    }
}

export function learnMove(skill, move) {
    return (dispatch, getState) => {
        let classCode = uiClassSelector(getState())
        let element = currentElementSelector(getState())

        dispatch(setBuildSkill(classCode, element, skill, move))
    }
}
