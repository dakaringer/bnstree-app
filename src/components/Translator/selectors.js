import {Map, List} from 'immutable'
import {createSelector} from 'reselect'

const uiSelector = state => state.getIn(['translator', 'ui'], Map())
const dataSelector = state => state.getIn(['translator', 'data'], Map())

//ui
export const languageSelector = createSelector(uiSelector, state => state.get('language', ''))
export const namespaceSelector = createSelector(uiSelector, state => state.get('namespace', null))
export const groupSelector = createSelector(uiSelector, state => state.get('group', null))
export const loadingSelector = createSelector(uiSelector, state => state.get('loading', Map()))
export const errorSelector = createSelector(uiSelector, state => state.get('error', false))

//data
export const languageStatusSelector = createSelector(dataSelector, data =>
    data.get('languageStatus', Map())
)

export const referenceDataSelector = createSelector(dataSelector, data => {
    data = data
        .get('referenceData', List())
        .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
        .groupBy(group => group.get('namespace'))
    return data
})
export const languageDataSelector = createSelector(dataSelector, data => {
    data = data
        .get('languageData', List())
        .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
        .groupBy(group => group.get('namespace'))
    return data
})
export const rawLanguageDataSelector = createSelector(dataSelector, data =>
    data.get('languageData', List())
)

export const referenceGroupDataSelector = createSelector(
    referenceDataSelector,
    namespaceSelector,
    groupSelector,
    (data, namespace, group) => {
        data = data.get(namespace, List())
        let index = data.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))
        if (index === -1) return Map()
        return data.getIn([index, 'data'], Map()).sort()
    }
)

export const languageGroupDataSelector = createSelector(
    languageDataSelector,
    namespaceSelector,
    groupSelector,
    (data, namespace, group) => {
        data = data.get(namespace, List())
        let index = data.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))
        if (index === -1) return Map()
        return data.getIn([index, 'data'], Map())
    }
)
