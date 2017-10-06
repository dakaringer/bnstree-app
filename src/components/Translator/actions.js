import * as actionType from './actionTypes'
import {Map, List} from 'immutable'

import {makeActionCreator} from '../../helpers'
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
    itemNameDataSelector
} from './selectors'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

const setLanguage = makeActionCreator(actionType.SET_TRANSLATOR_LANGUAGE, 'language')
export const setNamespace = makeActionCreator(actionType.SET_TRANSLATOR_NAMESPACE, 'namespace')
export const setGroup = makeActionCreator(actionType.SET_TRANSLATOR_GROUP, 'group')
const setTranslatorLoading = makeActionCreator(
    actionType.SET_TRANSLATOR_LOADING,
    'loading',
    'context'
)
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

export function loadLanguageData() {
    return (dispatch, getState) => {
        dispatch(setLoading(true, 'language'))
        fetch('https://api.bnstree.com/languages/data', {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    dispatch(setLanguage(json.lang))
                    dispatch(setStatusData(json.languageStatus))
                    dispatch(setData('referenceData', json.enReference))
                    dispatch(setData('languageData', json.languageData))
                    dispatch(setData('skillNames', json.skillNames))
                    dispatch(setData('itemNames', json.itemNames))
                }
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
                                let text = data.getIn(['name', languageCode], '')
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
        let languageCode = languageSelector(getState())
        let namespace = namespaceSelector(getState())
        let group = groupSelector(getState())
        let data = rawLanguageDataSelector(getState())

        let index = data.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))

        let groupData =
            index !== -1
                ? data.get(index, Map())
                : Map({
                      _id: `${languageCode.toUpperCase()}_${group.substr(3)}`,
                      namespace: namespace,
                      language: languageCode
                  })

        if (value.trim() !== '') {
            groupData = groupData.setIn(['data', key], value)
        } else {
            groupData = groupData.deleteIn(['data', key])
        }

        if (index !== -1) {
            dispatch(editData('languageData', index, groupData))
        } else {
            dispatch(pushData('languageData', groupData))
        }
        dispatch(
            setLanguageDataStatus(namespace, group, key, verify(namespace, group, key, getState()))
        )
    }
}

export function editNameTranslation(key, type, value, reference) {
    return (dispatch, getState) => {
        let languageCode = languageSelector(getState())
        let namespace = namespaceSelector(getState())
        let group = groupSelector(getState())

        let data =
            namespace === 'skills'
                ? rawSkillNameDataSelector(getState())
                : rawItemNameDataSelector(getState())
        let index = data.findIndex(g => g.get('_id', '') === key)

        data = data.get(index).setIn([type, languageCode], value)

        let context = namespace === 'skills' ? 'skillNames' : 'itemNames'
        dispatch(editData(context, index, data))

        dispatch(
            setLanguageDataStatus(namespace, group, key, value.trim() !== '' ? 'success' : 'error')
        )
    }
}

export function saveTranslation() {
    return (dispatch, getState) => {
        let languageData = rawLanguageDataSelector(getState()).toJS()
        let skillNames = rawSkillNameDataSelector(getState()).toJS()
        let itemNames = rawItemNameDataSelector(getState()).toJS()
        let status = languageStatusSelector(getState()).toJS()

        dispatch(setError(false))
        dispatch(setTranslatorLoading(true, 'data'))
        dispatch(setTranslatorLoading(true, 'status'))
        fetch('https://api.bnstree.com/languages/data', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({
                languageData: languageData,
                skillNames: skillNames,
                itemNames: itemNames
            })
        })
            .then(response => response.json())
            .then(json => {
                if (json.success !== 1) dispatch(setError(true))
            })
            .then(() => dispatch(setTranslatorLoading(false, 'data')))
            .catch(e => console.error(e))

        fetch('https://api.bnstree.com/languages/status', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({data: status})
        })
            .then(response => response.json())
            .then(json => {
                if (json.success !== 1) dispatch(setError(true))
            })
            .then(() => dispatch(setTranslatorLoading(false, 'status')))
            .catch(e => console.error(e))
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
