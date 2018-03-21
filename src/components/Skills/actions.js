import * as actionType from './actionTypes'
import { Map, List } from 'immutable'
import i18n from '../../i18n'
import { message } from 'antd'
import apollo, { q } from '../../apollo'

import { makeActionCreator, flatten } from '../../helpers'
import { setLoading, setViewOption } from '../../actions'
import {
    classSelector,
    buildElementSelector,
    classElementDataSelector,
    buildSelector,
    buildListSelector,
    characterModeSelector,
    groupedSkillDataSelector,
    patchSelector,
    buildFormatSelector
} from './selectors'
import { userSelector, viewSelector } from '../../selectors'

const setClass = makeActionCreator(actionType.SKILL_UI_SET_CLASS, 'classCode')
export const setFilter = makeActionCreator(actionType.SKILL_UI_SET_FILTER, 'filter')
export const setSearch = makeActionCreator(actionType.SKILL_UI_SET_SEARCH, 'search')
const setPatch = makeActionCreator(actionType.SKILL_UI_SET_PATCH, 'patch')
export const setCharacterMode = makeActionCreator(actionType.SKILL_UI_SET_CHARACTER_MODE, 'mode')

export const setStat = makeActionCreator(actionType.SKILL_CHAR_SET_STAT, 'stat', 'value')
export const setElementDmg = makeActionCreator(
    actionType.SKILL_CHAR_SET_ELEMENT_DMG,
    'element',
    'value'
)
export const setEquip = makeActionCreator(actionType.SKILL_CHAR_SET_EQUIP, 'equipType', 'item')

const setClassData = makeActionCreator(actionType.SKILL_DATA_SET_CLASS_DATA, 'classCode', 'data')
const setSkillPatchData = makeActionCreator(
    actionType.SKILL_DATA_SET_SKILL_PATCH_DATA,
    'classCode',
    'patch',
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

const classQuery = q`query ($classCode: String!) {
    Skills {
        elementData(classCode: $classCode) {
            elements {
                element
                additionalFilters
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
    }
    SkillBuilds {
        skillBuildStatistics(classCode: $classCode) {
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

const buildListQuery = q`query (
    $page: Int,
    $limit: Int,
    $classCode: String,
    $element: String,
    $type: String,
    $user: Boolean
) {
    SkillBuilds {
        list(
            limit: $limit,
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
            patch
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
            patch
        }
    }
}`

const skillPatchQuery = q`query ($patch: Int!, $classCode: String!) {
    Skills {
        skillData(classCode: $classCode) {
            skillPatches(patch: $patch) {
                patch
                type
                data
            }
        }
    }
}`

const saveBuildMutation = q`mutation (
    $title: String!,
    $classCode: String!,
    $type : String!,
    $element: String!,
    $buildObjects: [BuildObjectInput]!,
    $patch: Int!
) {
    SkillBuilds {
        saveBuild(
            title: $title,
            classCode: $classCode,
            type: $type,
            element: $element,
            buildObjects: $buildObjects
            patch: $patch
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
        dispatch(setPatch('BASE'))
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
                    buildCount: flatten(json.data.SkillBuilds.skillBuildStatistics.buildCount),
                    statData: flatten(json.data.SkillBuilds.skillBuildStatistics.buildStatistics),
                    classData: json.data.Skills.elementData.elements,
                    groupData: flatten(json.data.Skills.skillData.skillGroups),
                    skillData: flatten(json.data.Skills.skillData.skills)
                }

                dispatch(setClassData(classCode, data))

                let view = viewSelector(getState())
                let element = view.getIn(['classElement', classCode], null)
                element = element ? element : data.classData[0].element
                dispatch(setBuildElement(classCode, element))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'skills')))
    }
}

export function loadBuildList(page = 1, classCode, element = null, type = null, user = null) {
    return dispatch => {
        let limit = 10

        apollo
            .query({
                query: buildListQuery,
                variables: {
                    page: page,
                    limit: limit,
                    classCode: classCode,
                    element: element,
                    type: type,
                    user: user
                },
                fetchPolicy: 'network-only'
            })
            .then(json => {
                let builds = Object.assign(
                    {
                        page: page,
                        limit: limit
                    },
                    json.data.SkillBuilds
                )
                if (user) {
                    dispatch(setUserBuildList(classCode, builds))
                } else {
                    dispatch(setBuildList(classCode, builds))
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
                    dispatch(setPatch(build.get('patch', 'BASE')))
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
                            dispatch(setPatch(build.patch))
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
                let classElements = classElementDataSelector(getState())
                let currentElement = classElements.get(buildCode[0], classElements.get(0))
                let buildString = buildCode.substring(1)

                dispatch(setPatch('BASE'))
                dispatch(setBuildElement(classCode, currentElement.get('element')))

                let buildFormat = buildFormatSelector(getState())
                buildFormat.forEach((id, i) => {
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
        let buildFormat = buildFormatSelector(getState())

        let classCode = classSelector(getState())
        let build = buildSelector(getState())
        let patch = patchSelector(getState())

        let buildObjects = []
        buildFormat.forEach(id => {
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
            buildObjects: buildObjects,
            patch: patch
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
        let classElements = classElementDataSelector(getState())
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

export function selectPatch(patch) {
    return (dispatch, getState) => {
        let classCode = classSelector(getState())
        dispatch(setPatch(parseInt(patch, 10)))
        apollo
            .query({
                query: skillPatchQuery,
                variables: {
                    patch: patch,
                    classCode: classCode
                }
            })
            .then(json => {
                dispatch(
                    setSkillPatchData(classCode, patch, json.data.Skills.skillData.skillPatches)
                )
            })
            .catch(e => console.error(e))
    }
}
