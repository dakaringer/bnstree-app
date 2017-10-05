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
export const rawLanguageDataSelector = createSelector(dataSelector, data =>
    data.get('languageData', List())
)
export const rawSkillNameDataSelector = createSelector(dataSelector, data =>
    data.get('skillNames', List())
)
export const rawItemNameDataSelector = createSelector(dataSelector, data =>
    data.get('itemNames', List())
)

export const referenceDataSelector = createSelector(dataSelector, data => {
    data = data
        .get('referenceData', List())
        .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
        .groupBy(group => group.get('namespace'))
    return data
})
export const languageDataSelector = createSelector(rawLanguageDataSelector, data => {
    data = data
        .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
        .groupBy(group => group.get('namespace'))
    return data
})

export const referenceGroupDataSelector = createSelector(
    referenceDataSelector,
    namespaceSelector,
    groupSelector,
    (data, namespace, group) => {
        data = data.get(namespace, List())
        let index = data.findIndex(g => g.get('_id', '').substr(3) === group.substr(3))
        if (index === -1) return Map()
        return data.getIn([index, 'data'], Map()).sortBy((value, key) => key)
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

const classCodes = {
    BLADE_MASTER: 20,
    KUNG_FU_MASTER: 21,
    DESTROYER: 24,
    FORCE_MASTER: 22,
    ASSASSIN: 25,
    SUMMONER: 26,
    BLADE_DANCER: 27,
    WARLOCK: 28,
    SOUL_FIGHTER: '30|35',
    GUNSLINGER: 23
}

export const nameDataSelector = createSelector(
    rawSkillNameDataSelector,
    rawItemNameDataSelector,
    namespaceSelector,
    groupSelector,
    (skills, items, namespace, group) => {
        switch (namespace) {
            case 'skills':
                let re = new RegExp(`^${classCodes[group]}`)
                return skills
                    .filter(skill => re.test(skill.get('_id', '')))
                    .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
            case 'items':
                return items
                    .filter(item => item.get('_id', '').startsWith(group))
                    .sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1))
            default:
                return List()
        }
    }
)
