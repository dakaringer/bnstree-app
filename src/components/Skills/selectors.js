import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {currentLanguageSelector} from '../../selectors'

function merger(a, b) {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(merger, b)
    }
    return b
}

const keyOrder = [
    'LB',
    'RB',
    'Tab',
    'F',
    '1',
    '2',
    '3',
    '4',
    'Z',
    'X',
    'C',
    'V',
    'G',
    'B',
    'Q',
    'E',
    'S',
    'Familiar',
    'Passive',
    'None'
]

const uiSelector = state => state.getIn([
    'skills', 'ui'
], Map())
export const charSelector = state => state.getIn([
    'skills', 'character'
], Map())
const dataSelector = state => state.getIn([
    'skills', 'data'
], Map())
const buildDataSelector = state => state.getIn([
    'skills', 'build'
], Map())
const refSelector = state => state.getIn([
    'skills', 'ref'
], Map())

//ui
export const classSelector = createSelector(uiSelector, state => state.get('classCode', 'BM'))
export const viewSelector = createSelector(uiSelector, state => state.get('view', Map()))
export const filterSelector = createSelector(uiSelector, state => state.get('filter', 'ALL'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const patchSelector = createSelector(uiSelector, state => state.get('patch', 'BASE'))

//build
export const buildElementSelector = createSelector(buildDataSelector, classSelector, (state, classCode) => state.getIn([classCode, 'element']))
export const buildSelector = createSelector(buildDataSelector, classSelector, buildElementSelector, (state, classCode, element) => state.getIn([classCode, 'build', element], Map()))

//ref
export const skillNamesSelector = createSelector(refSelector, state => state.get('skillNames', Map()))

//data
const classDataSelector = createSelector(dataSelector, classSelector, (state, classCode) => state.get(classCode, Map()))
export const buildFormatSelector = createSelector(classDataSelector, buildElementSelector, (data, element) => {
    return data.find(a => a.get('element') === element, null, Map()).get('buildFormat', List())
})

const groupDataSelector = createSelector(classDataSelector, data => data.get('groupData', Map()))

const patchDataSelector = createSelector(classDataSelector, data => data.get('patchData', Map()))
export const mergedPatchDataSelector = createSelector(patchDataSelector, patchSelector, (data, patchDate) => {
    let result = Map()
    if (patch !== 'BASE') {
        data.forEach((patches, id) => {
            patches = patches.filter(skill => {
                return skill.get('patch') <= patchDate
            })

            let changes = Map()
            patches.forEach(patch => {
                changes = changes.mergeWith(merger, patch)
            })

            result.set(id, changes)
        })
    }
    return result
})

const skillDataSelector = createSelector(classDataSelector, data => data.get('skillData', Map()))
const patchedSkillDataSelector = createSelector(skillDataSelector, mergedPatchDataSelector, (data, patch) => {
    return data.mergeWith(merger, patch).filter(skill => !skill.get('deleted', false))
})
const elementSkillDataSelector = createSelector(patchedSkillDataSelector, buildElementSelector, (data, element) => {
    return data.filter(skill => skill.get('elementSpec', element) === element)
})
const groupedSkillDataSelector = createSelector(elementSkillDataSelector, groupDataSelector, viewSelector, (data, groupData, view) => {
    data = data.sort((a, b) => {
        if (a.get('move', '') < b.get('move', '')) {
            return -1
        }
        else {
            return 1
        }
    })
    data = data.groupBy(skill => skill.get('groupId')).sortBy((value, key) => key, (a, b) => {
        if (a < b) {
            return -1
        }
        else {
            return 1
        }
    })

    groupData = groupData.map((group, id) => {
        return group.set('moves', data.get(id))
    })

    if (view.get('visibility', 'ALL') !== 'ALL') {
        groupData = groupData.filter(group => group.get('moves', List()).size > 1)
    }

    if (view.get('mode', 'LIST') === 'GRID' || view.get('order', 'HOTKEY') === 'HOTKEY') {
        groupData = groupData.groupData(group => group.get('hotkey')).sortBy((value, key) => key, (a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
    }
    else {
        groupData = groupData.groupBy(group => group.get('minLevel')).sortBy((value, key) => key, (a, b) => a - b)
    }
})
export const filteredSkillDataSelector = createSelector(groupedSkillDataSelector, filterSelector, searchSelector, buildElementSelector, (data, filter, search, element) => {
    return data.filter(group => {
        let filterOK = filter === 'ALL'
        let searchOK = false

        group.get('moves', List()).forEach(skill => {
            let filterList = skill.get('filter', List())
            if (Map.isMap(filterList)) {
                filterList = filterList.get(element, List())
            }

            filterOK = filterOK || filterList.includes(filter)
            searchOK = searchOK || skill.get('name', '').toLowerCase().startsWith(search.trim().toLowerCase())
        })

        return filterOK && searchOK
    })
})
