import * as actionType from './actionTypes'
import {pair, flatten, makeActionCreator} from '../shared/actionHelpers'


import {visibilitySelector} from './selector'

import * as actionTypeSkill from '../trainer2/actionTypes'
import {setLoading} from '../../actions'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
const setRegion = makeActionCreator(actionType.SET_REGION, 'region')
const loadCharacterData = makeActionCreator(actionType.LOAD_CHARACTER, 'characterData')
const setVisibility = makeActionCreator(actionType.SET_VISIBILITY, 'visibility')
export const setTab = makeActionCreator(actionType.SET_CHARACTER_TAB, 'tab')

const loadClassData = makeActionCreator(actionTypeSkill.LOAD_CLASS, 'classCode', 'elements', 'skills')
const setIcons = makeActionCreator(actionTypeSkill.SET_ICONS, 'icons')
const setSkillNames = makeActionCreator(actionTypeSkill.SET_SKILL_NAMES, 'names')
const setSkillTemplates = makeActionCreator(actionTypeSkill.SET_TEMPLATES, 'templates')
const setConstants = makeActionCreator(actionTypeSkill.SET_CONSTANTS, 'constants')
const setTags = makeActionCreator(actionTypeSkill.SET_TAGS, 'tags')
const setPatchRef = makeActionCreator(actionTypeSkill.SET_PATCH_REF, 'patches')

export function loadCharacter(region, name) {
    return (dispatch) => {
        if (name) {
            dispatch(setLoading(true))
            dispatch(setRegion(region))
            fetch('/api/character/getCharacter', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({region: region, name: name.trim()})
            }).then(response => response.json()).then(json => {
                if (json.general) {
                    document.title = `${json.general.name} | BnSTree`

                    dispatch(loadCharacterData(json))

                    let classCode = json.general.classCode
                    fetch('/api/trainer2/getClassData', {
                        method: 'post',
                        credentials: 'include',
                        headers: postHeaders,
                        body: JSON.stringify({classCode: classCode})
                    }).then(response => response.json()).then(json => {
                        let elements = json.classData.elements
                        dispatch(loadClassData(classCode, elements, flatten(json.skillList)))

                        dispatch(setLoading(false))
                    })
                }
                else {
                    dispatch(loadCharacterData(null))
                    dispatch(setLoading(false))
                }
            })
        }
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
            dispatch(setSkillTemplates(pair(json.templates, 'template')))
            dispatch(setIcons(pair(json.ref, 'icon')))
            dispatch(setSkillNames(pair(json.ref, 'name')))
            dispatch(setTags(flatten(json.tags)))
            dispatch(setConstants(pair(json.constants, lang)))
            dispatch(setPatchRef(flatten(json.patches)))
        })
    }
}

export function toggleVisibility() {
    return (dispatch, getState) => {
        let current = visibilitySelector(getState())

        dispatch(setVisibility(!current))
    }
}
