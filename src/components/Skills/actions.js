import * as actionType from './actionTypes'
import {Map, List} from 'immutable'
import i18n from '../../i18n'
import {message} from 'antd'
import apollo, {q} from '../../apollo'

import {makeActionCreator, flatten} from '../../helpers'
import {setLoading, setViewOption} from '../../actions'
import {
    classSelector,
    buildElementSelector,
    elementDataSelector,
    buildSelector,
    buildListSelector,
    characterModeSelector,
    groupedSkillDataSelector
} from './selectors'
import {userSelector, viewSelector} from '../../selectors'

const setClass = makeActionCreator(actionType.SKILL_UI_SET_CLASS, 'classCode')
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

const setClassData = makeActionCreator(actionType.SKILL_DATA_SET_CLASS_DATA, 'classCode', 'data')
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

const classQuery = q`query ($classCode: String!) {
    Skills {
        elementData(classCode: $classCode) {
            elements {
                element
                additionalFilters
                buildFormat
            }
        }
        skillData(classCode: $classCode) {
            skills 
            skillGroups {
                _id
                minLevel
                hotkey
            }
        }
        buildData(classCode: $classCode) {
            buildCount {
                _id
                count
            }
            buildStatistics {
                _id
                types
            }
        }
    }
}`

const namesQuery = q`query ($language: String!, $en: Boolean!) {
    Skills {
        names(language: $language) {
            skills {
                _id
                name
                icon
            }
        }
        enNames: names(language: "en") @skip(if: $en) {
            skills {
                _id
                name
                icon
            }
        }
    }
}`

const buildListQuery = q`query (
    $page: Int,
    $classCode: String,
    $element: String,
    $type: String,
    $user: Boolean
) {
    SkillBuilds {
        list(
            limit: 10,
            page: $page,
            classCode: $classCode,
            element: $element,
            type: $type,
            user: $user
        ) {
            _id
            title
            datePosted
            type
            classCode
            element
            buildObjects {
                skillId: id
                trait
            }
        }
        count(
            limit: 10,
            page: $page,
            classCode: $classCode,
            element: $element,
            type: $type,
            user: $user
        ) 
    }
}`

const buildQuery = q`query ($id: ID!) {
    SkillBuilds {
        build(id: $id) {
            _id
            title
            datePosted
            type
            classCode
            element
            buildObjects {
                skillId: id
                trait
            }
        }
    }
}`

const saveBuildMutation = q`mutation (
    $title: String!,
    $classCode: String!,
    $type : String!,
    $element: String!,
    $buildObjects: [BuildObjectInput]!
) {
    SkillBuilds {
        createBuild(
            title: $title,
            classCode: $classCode,
            type: $type,
            element: $element,
            buildObjects: $buildObjects
        )
    }
}`

const deleteBuildMutation = q`mutation (
    $id: ID!
) {
    SkillBuilds {
        deleteBuild(
            id: $id
        )
    }
}`

export function loadSkills(classCode, buildCode, buildId) {
    return (dispatch, getState) => {
        dispatch(setCharacterMode(false))
        dispatch(setClass(classCode))
        dispatch(setFilter('ALL'))
        dispatch(setSearch(''))

        dispatch(loadBuildList(1, classCode))
        if (userSelector(getState())) {
            dispatch(loadBuildList(1, classCode, null, null, true))
        }
        dispatch(setLoading(true, 'skills'))
        apollo
            .query({
                query: classQuery,
                variables: {
                    classCode: classCode
                }
            })
            .then(json => {
                let data = {
                    buildCount: flatten(json.data.Skills.buildData.buildCount),
                    statData: flatten(json.data.Skills.buildData.buildStatistics),
                    classData: json.data.Skills.elementData.elements,
                    groupData: flatten(json.data.Skills.skillData.skillGroups),
                    skillData: flatten(json.data.Skills.skillData.skills)
                }
                dispatch(setClassData(classCode, data))

                let view = viewSelector(getState())
                let element = view.getIn(['classElements', classCode], null)
                element = element ? element : data.classData[0].element
                dispatch(setBuildElement(classCode, element))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'skills')))
    }
}

export function loadTextData(lang) {
    return (dispatch, getState) => {
        apollo
            .query({
                query: namesQuery,
                variables: {
                    language: lang,
                    en: lang === 'en'
                }
            })
            .then(json => {
                dispatch(setSkillNames(lang, flatten(json.data.Skills.names.skills)))

                if (json.data.Skills.enNames) {
                    dispatch(setSkillNames('en', flatten(json.data.Skills.enNames.skills)))
                }
            })
            .catch(e => console.error(e))
    }
}

export function loadBuildList(page = 1, classCode, element = null, type = null, user = null) {
    return dispatch => {
        apollo
            .query({
                query: buildListQuery,
                variables: {
                    page: page,
                    classCode: classCode,
                    element: element,
                    type: type,
                    user: user
                },
                fetchPolicy: 'network-only'
            })
            .then(json => {
                if (user) {
                    dispatch(setUserBuildList(classCode, json.data.SkillBuilds))
                } else {
                    dispatch(setBuildList(classCode, json.data.SkillBuilds))
                }
            })
            .catch(e => console.error(e))
    }
}

export function loadBuild(buildCode, buildId) {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())

        if (buildCode || buildId) {
            dispatch(setViewOption('skillVisibility', 'TRAINABLE'))
            if (buildId) {
                let buildList = buildListSelector(getState()).get('list', List())
                let build = buildList.find(build => build.get('_id') === buildId)

                if (build) {
                    dispatch(setBuildElement(classCode, build.get('element')))
                    build.get('buildObjects', List()).forEach(skill => {
                        dispatch(learnMove(skill.get('skillId'), skill.get('trait')))
                    })
                } else {
                    dispatch(setLoading(true, 'skills'))
                    apollo
                        .query({
                            query: buildQuery,
                            variables: {
                                id: buildId
                            }
                        })
                        .then(json => {
                            let build = json.data.SkillBuilds.build
                            dispatch(setBuildElement(classCode, build.element))
                            build.buildObjects.forEach(skill => {
                                dispatch(learnMove(skill.skillId, skill.trait))
                            })
                        })
                        .catch(e => {
                            console.error(e)
                        })
                        .then(() => dispatch(setLoading(false, 'skills')))
                }
            } else if (buildCode && !isNaN(buildCode)) {
                let elementData = elementDataSelector(getState())
                let currentElement = elementData.get(buildCode[0], elementData.get(0))
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

        apollo
            .mutate({
                mutation: saveBuildMutation,
                variables: buildDoc
            })
            .then(json => {
                dispatch(loadBuildList(1, classCode))
                dispatch(loadBuildList(1, classCode, null, null, true))
                message.success(i18n.t('general:postSuccess'))
            })
            .catch(e => {
                console.error(e)
                message.error(i18n.t('general:fail'))
            })
    }
}

export function deleteBuild(id, classCode) {
    return dispatch => {
        apollo
            .mutate({
                mutation: deleteBuildMutation,
                variables: {
                    id: id
                }
            })
            .then(json => {
                message.success(i18n.t('general:deleteSuccess'))
                dispatch(loadBuildList(1, classCode))
                dispatch(loadBuildList(1, classCode, null, null, true))
            })
            .catch(e => {
                console.error(e)
                message.error(i18n.t('general:fail'))
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
        dispatch(
            setViewOption('classElement', {
                classCode: classCode,
                element: otherElement
            })
        )
    }
}

export function learnMove(skill, move) {
    return (dispatch, getState) => {
        if (!characterModeSelector(getState())) {
            let classCode = classSelector(getState())
            let element = buildElementSelector(getState())
            let skillData = groupedSkillDataSelector(getState()).get(skill, Map())
            skillData.forEach(s => {
                if (s.get('move', 1) === move) {
                    dispatch(setBuildSkill(classCode, element, skill, move))
                    return false
                }
            })
        }
    }
}
