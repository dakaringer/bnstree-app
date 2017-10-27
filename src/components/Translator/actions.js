import * as actionType from './actionTypes'
import {Map, List} from 'immutable'
import apollo, {q} from '../../apollo'

import {makeActionCreator, flatten} from '../../helpers'
import {setLoading} from '../../actions'
import {
    namespaceSelector,
    groupSelector,
    languageStatusSelector,
    languageSelector,
    rawLanguageDataSelector,
    rawSkillNameDataSelector,
    rawItemNameDataSelector,
    referenceDataSelector,
    languageDataSelector,
    skillNameDataSelector,
    itemNameDataSelector,
    savingLanguageDataSelector,
    savingSkillNameDataSelector,
    savingItemNameDataSelector
} from './selectors'

const setLanguage = makeActionCreator(actionType.SET_TRANSLATOR_LANGUAGE, 'language')
export const setNamespace = makeActionCreator(actionType.SET_TRANSLATOR_NAMESPACE, 'namespace')
export const setGroup = makeActionCreator(actionType.SET_TRANSLATOR_GROUP, 'group')
const setTranslatorSaving = makeActionCreator(actionType.SET_TRANSLATOR_SAVING, 'saving')
const setError = makeActionCreator(actionType.SET_TRANSLATOR_ERROR, 'error')

export const setLanguageName = makeActionCreator(actionType.SET_TRANSLATOR_LANGUAGE_NAME, 'name')
export const setLanguageStatus = makeActionCreator(
    actionType.SET_TRANSLATOR_LANGUAGE_STATUS,
    'status'
)
const setStatusData = makeActionCreator(actionType.SET_TRANSLATOR_LANGUAGE_STATUS_DATA, 'data')
const setData = makeActionCreator(actionType.SET_TRANSLATOR_LANGUAGE_DATA, 'context', 'data')
const editData = makeActionCreator(
    actionType.EDIT_TRANSLATOR_LANGUAGE_DATA,
    'context',
    'index',
    'data'
)
const pushData = makeActionCreator(actionType.PUSH_TRANSLATOR_LANGUAGE_DATA, 'context', 'data')

const setLanguageDataStatus = makeActionCreator(
    actionType.SET_TRANSLATOR_LANGUAGE_DATA_STATUS,
    'namespace',
    'group',
    'key',
    'status'
)
const setLanguageDataStatusMap = makeActionCreator(
    actionType.SET_TRANSLATOR_LANGUAGE_DATA_STATUS_MAP,
    'map'
)

const dataQuery = q`query {
    Translator {
        languageStatus {
            _id
            name
            enabled
        }
        languageData {
            _id
            language
            namespace
            data
        }
        referenceData: languageData(reference: true) {
            _id
            language
            namespace
            data
        }
        skillNames
        itemNames
        language
        skillExamples
        badgeExamples
        soulshieldExamples
    }
}`

const saveMutation = q`mutation (
    $languageStatus: LanguageStatusInput!,
    $languageData: [LanguageGroupInput]!,
    $skillNames: [NameInput]!,
    $itemNames: [NameInput]!
) {
    Translator {
        updateStatus(data: $languageStatus)
        updateLanguageData(languageData: $languageData)
        updateSkillNames(skillNames: $skillNames)
        updateItemNames(itemNames: $itemNames)
    }
}`

export function loadLanguageData() {
    return (dispatch, getState) => {
        dispatch(setLoading(true, 'language'))
        dispatch(setError(false))
        dispatch(setTranslatorSaving(null))

        dispatch(setData('savingLanguageData', []))
        dispatch(setData('savingSkillNameData', []))
        dispatch(setData('savingItemNameData', []))

        apollo
            .query({
                query: dataQuery
            })
            .then(json => {
                let data = json.data.Translator
                dispatch(setLanguage(data.language))
                dispatch(setStatusData(data.languageStatus))
                dispatch(setData('referenceData', data.referenceData))
                dispatch(setData('languageData', data.languageData))
                dispatch(setData('skillNames', data.skillNames))
                dispatch(setData('itemNames', data.itemNames))

                let examples = []
                examples = examples.concat(data.skillExamples)
                examples = examples.concat(data.badgeExamples)
                examples = examples.concat(data.soulshieldExamples)
                dispatch(setData('examples', flatten(examples)))
            })
            .then(() => {
                dispatch(setLoading(false, 'language'))

                let dataStatus = Map()
                let referenceData = referenceDataSelector(getState())
                dataStatus = dataStatus.withMutations(map => {
                    referenceData.forEach((namespaceData, namespace) => {
                        namespaceData.forEach(groupData => {
                            let group = groupData.get('_id')
                            groupData.get('data', Map()).forEach((data, key) => {
                                if (!key.endsWith('_plural')) {
                                    map.setIn(
                                        [namespace, group, key],
                                        verify(namespace, group, key, getState())
                                    )
                                }
                            })
                        })
                    })
                })

                let languageCode = languageSelector(getState())
                let skillNameData = skillNameDataSelector(getState())
                let itemNameData = itemNameDataSelector(getState())
                let nameData = Map()
                nameData = nameData.withMutations(map => {
                    map.set('skills', skillNameData).set('items', itemNameData)
                })
                dataStatus = dataStatus.withMutations(map => {
                    nameData.forEach((namespaceData, namespace) => {
                        namespaceData.forEach((groupData, group) => {
                            groupData.forEach(data => {
                                let key = data.get('_id', '')
                                let text = data.getIn(['name', languageCode], '') || ''
                                map.setIn(
                                    [namespace, group, key],
                                    text.trim() !== '' ? 'success' : 'error'
                                )
                            })
                        })
                    })
                })
                dispatch(setLanguageDataStatusMap(dataStatus))
            })
            .catch(e => console.error(e))
    }
}

export function editTranslation(key, value) {
    return (dispatch, getState) => {
        if (value.length > 256) return
        let languageCode = languageSelector(getState())
        let namespace = namespaceSelector(getState())
        let group = groupSelector(getState())
        let data = rawLanguageDataSelector(getState())
        let savingData = savingLanguageDataSelector(getState())

        let index = data.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))
        let saveIndex = savingData.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))

        let groupData =
            index !== -1
                ? data.get(index, Map())
                : Map({
                      _id: `${languageCode.toUpperCase()}_${group.substr(3)}`,
                      namespace: namespace,
                      language: languageCode
                  })
        let savingGroupData =
            saveIndex !== -1
                ? data.get(index, Map())
                : Map({
                      _id: `${languageCode.toUpperCase()}_${group.substr(3)}`,
                      namespace: namespace,
                      language: languageCode
                  })

        if (value.trim() !== '') {
            groupData = groupData.setIn(['data', key], value)
            savingGroupData = savingGroupData.setIn(['data', key], value)
        } else {
            groupData = groupData.deleteIn(['data', key])
            savingGroupData = savingGroupData.deleteIn(['data', key])
        }

        if (index !== -1) {
            dispatch(editData('languageData', index, groupData))
        } else {
            dispatch(pushData('languageData', groupData))
        }
        if (saveIndex !== -1) {
            dispatch(editData('savingLanguageData', saveIndex, savingGroupData))
        } else {
            dispatch(pushData('savingLanguageData', savingGroupData))
        }

        dispatch(
            setLanguageDataStatus(namespace, group, key, verify(namespace, group, key, getState()))
        )
    }
}

export function editNameTranslation(key, type, value, reference) {
    return (dispatch, getState) => {
        if (value.length > 256) return
        let languageCode = languageSelector(getState())
        let namespace = namespaceSelector(getState())
        let group = groupSelector(getState())

        let data =
            namespace === 'skills'
                ? rawSkillNameDataSelector(getState())
                : rawItemNameDataSelector(getState())
        let savingData =
            namespace === 'skills'
                ? savingSkillNameDataSelector(getState())
                : savingItemNameDataSelector(getState())
        let index = data.findIndex(g => g.get('_id', '') === key)
        let saveIndex = savingData.findIndex(g => g.get('_id', '') === key)

        data = data.get(index).setIn([type, languageCode], value)

        let context = namespace === 'skills' ? 'skillNames' : 'itemNames'
        dispatch(editData(context, index, data))

        let savingContext = namespace === 'skills' ? 'savingSkillNameData' : 'savingItemNameData'
        if (saveIndex !== -1) {
            dispatch(editData(savingContext, saveIndex, data))
        } else {
            dispatch(pushData(savingContext, data))
        }

        dispatch(
            setLanguageDataStatus(namespace, group, key, value.trim() !== '' ? 'success' : 'error')
        )
    }
}

export function saveTranslation() {
    return (dispatch, getState) => {
        let languageData = savingLanguageDataSelector(getState())
        let skillNames = savingSkillNameDataSelector(getState())
        let itemNames = savingItemNameDataSelector(getState())
        let status = languageStatusSelector(getState()).toJS()

        dispatch(setError(false))
        dispatch(setTranslatorSaving(true))

        apollo
            .mutate({
                mutation: saveMutation,
                variables: {
                    languageStatus: {
                        _id: status._id,
                        name: status.name,
                        enabled: status.enabled
                    },
                    languageData: languageData
                        .map(data => {
                            return {
                                _id: data.get('_id'),
                                language: data.get('language'),
                                namespace: data.get('namespace'),
                                data: data.get('data')
                            }
                        })
                        .toJS(),
                    skillNames: skillNames.toJS(),
                    itemNames: itemNames.toJS()
                }
            })
            .then(json => {
                dispatch(setData('savingLanguageData', []))
                dispatch(setData('savingSkillNameData', []))
                dispatch(setData('savingItemNameData', []))
            })
            .catch(e => {
                console.error(e)
                dispatch(setError(true))
            })
            .then(() => dispatch(setTranslatorSaving(false)))
    }
}

function verify(namespace, group, key, state) {
    let reference = referenceDataSelector(state)
        .get(namespace, List())
        .find(g => g.get('_id').substr(3) === group.substr(3), null, Map())
        .getIn(['data', key], '')
    let data = languageDataSelector(state)
        .get(namespace, List())
        .find(g => g.get('_id').substr(3) === group.substr(3), null, Map())
        .getIn(['data', key], '')

    const re = /({{\w+}})/g
    let variables = []
    let m

    do {
        m = re.exec(reference)
        if (m) {
            variables.push(m[1])
        }
    } while (m)

    let variableCheck = true
    variables.forEach(v => {
        variableCheck = variableCheck && data.includes(v)
    })

    if (data.trim() === '') {
        return 'error'
    } else if (!variableCheck) {
        return 'warning'
    } else {
        return 'success'
    }
}
