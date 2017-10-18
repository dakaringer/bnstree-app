import {Map, List} from 'immutable'
import {createSelector} from 'reselect'

const uiSelector = state => state.getIn(['translator', 'ui'], Map())
const dataSelector = state => state.getIn(['translator', 'data'], Map())

//ui
export const languageSelector = createSelector(uiSelector, state => state.get('language', ''))
export const namespaceSelector = createSelector(uiSelector, state => state.get('namespace', null))
export const groupSelector = createSelector(uiSelector, state => state.get('group', null))
export const savingSelector = createSelector(uiSelector, state => state.get('saving', null))
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
export const exampleDataSelector = createSelector(dataSelector, data => data.get('examples', Map()))

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

export const skillNameDataSelector = createSelector(rawSkillNameDataSelector, data => {
    data = data.sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1)).groupBy(skill => {
        let code = skill.get('_id', '').substr(0, 2)
        switch (code) {
            case '20':
                return 'BLADE_MASTER'
            case '21':
                return 'KUNG_FU_MASTER'
            case '24':
                return 'DESTROYER'
            case '22':
                return 'FORCE_MASTER'
            case '25':
                return 'ASSASSIN'
            case '26':
                return 'SUMMONER'
            case '27':
                return 'BLADE_DANCER'
            case '28':
                return 'WARLOCK'
            case '23':
                return 'GUNSLINGER'
            default:
                return 'SOUL_FIGHTER'
        }
    })

    return data
})
export const itemNameDataSelector = createSelector(rawItemNameDataSelector, data => {
    return data.sort((a, b) => (a.get('_id') > b.get('_id') ? 1 : -1)).groupBy(item => {
        if (item.get('_id', '').startsWith('BADGE_SOUL')) return 'BADGE_SOUL'
        if (item.get('_id', '').startsWith('BADGE_MYSTIC')) return 'BADGE_MYSTIC'
        return 'SOULSHIELD'
    })
})

export const nameDataSelector = createSelector(
    skillNameDataSelector,
    itemNameDataSelector,
    namespaceSelector,
    groupSelector,
    (skills, items, namespace, group) => {
        switch (namespace) {
            case 'skills':
                return skills.get(group, List())
            case 'items':
                return items.get(group, List())
            default:
                return List()
        }
    }
)

export const dataStatusSelector = createSelector(dataSelector, data => {
    data = data.get('dataStatus', Map())
    return data.map(namespace => {
        let namespaceStatus = 'success'
        namespace = namespace.map(group => {
            let groupStatus = 'success'
            group.forEach(key => {
                groupStatus = getStatusPriority(groupStatus, key)
            })
            namespaceStatus = getStatusPriority(namespaceStatus, groupStatus)
            return group.set('dataStatus', groupStatus)
        })
        return namespace.set('dataStatus', namespaceStatus)
    })
})

let priority = ['success', 'warning', 'error']

function getStatusPriority(status, newStatus) {
    if (priority.indexOf(newStatus) > priority.indexOf(status)) return newStatus
    return status
}
