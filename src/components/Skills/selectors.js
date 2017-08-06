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

const tagOrder = [
    'STUN',
    'DAZE',
    'KNOCKDOWN',
    'KNOCKBACK',
    'UNCONSCIOUS',
    'GRAB',
    'PHANTOM_GRIP',
    'GRAPPLE',
    'FROST_PRISON',
    'AERIAL',
    'PULL',
    'LOCKDOWN',
    'DEEP_FREEZE',
    'ROOT',
    'CHILL',
    'FREEZE',
    'BLEED',
    'DEEP_WOUND',
    'CHARGE_DISABLE',
    'DEFENSE_DISABLE',
    'OFFENSIVE_DEFENSE_DISABLE',
    'JOINT_ATTACK',
    'HEAL',
    'PARTY_BUFF',
    'SOULBURN',
    'TIME_WARP',
    'RESTRAIN',
    'AMPLIFICATION',
    'TIME_DISTORTION',
    'INSPIRATION',
    'REVIVAL',
    'PARTY_PROTECTION',
    'SOULBLADE_PROTECTION',
    'STEALTH_PROTECTION',
    'FREEZE_PROTECTION',
    'CHARGE',
    'DEFENSE',
    'OFFENSIVE_DEFENSE',
    'BLOCK',
    'COUNTER',
    'DEFLECT',
    'DAMAGE_RESIST',
    'STATUS_RESIST',
    'PROJECTILE_RESIST',
    'DEFENSE_PENETRATION',
    'DEFLECT_PENETRATION',
    'DEFENSE_BREAK',
    'THREAT',
    'TAUNT',
    'FAMILIAR',
    'PROJECTILE',
    'MOVEMENT',
    'ESCAPE',
    'WINDWALK'
]

const uiSelector = state => state.getIn(['skills', 'ui'], Map())
export const charSelector = state => state.getIn(['skills', 'character'], Map())
export const dataSelector = state => state.getIn(['skills', 'data'], Map())
const buildDataSelector = state => state.getIn(['skills', 'build'], Map())
export const refSelector = state => state.getIn(['skills', 'ref'], Map())

//ui
export const classSelector = createSelector(uiSelector, state => state.get('classCode', 'BM'))
export const viewSelector = createSelector(uiSelector, state => state.get('view', Map()))
export const filterSelector = createSelector(uiSelector, state => state.get('filter', 'ALL'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const patchSelector = createSelector(uiSelector, state => state.get('patch', 'BASE'))

//build
export const buildElementSelector = createSelector(
    buildDataSelector,
    classSelector,
    (state, classCode) => state.getIn([classCode, 'element'])
)
export const buildSelector = createSelector(
    buildDataSelector,
    classSelector,
    buildElementSelector,
    (state, classCode, element) => state.getIn([classCode, 'build', element], Map())
)

//ref
export const skillNamesSelector = createSelector(
    refSelector,
    currentLanguageSelector,
    (state, language) => state.getIn(['skillNames', language], Map())
)

//data
const classDataSelector = createSelector(dataSelector, classSelector, (state, classCode) =>
    state.get(classCode, Map())
)
export const elementDataSelector = createSelector(classDataSelector, state =>
    state.get('classData', List())
)
export const buildListSelector = createSelector(classDataSelector, state =>
    state.get('buildList', Map())
)

const groupDataSelector = createSelector(classDataSelector, data => data.get('groupData', Map()))

const patchDataSelector = createSelector(classDataSelector, data => data.get('patchData', Map()))
export const mergedPatchDataSelector = createSelector(
    patchDataSelector,
    patchSelector,
    (data, patchDate) => {
        let result = Map()
        if (patchDate !== 'BASE') {
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
    }
)

const skillDataSelector = createSelector(classDataSelector, data => data.get('skillData', Map()))
const namedSkillDataSelector = createSelector(
    skillDataSelector,
    skillNamesSelector,
    (data, names) => {
        return data.map(skill => {
            let id = skill.get('skillId')
            let tags = skill
                .get('tags', List())
                .sort((a, b) => tagOrder.indexOf(a) - tagOrder.indexOf(b))
            return skill
                .set('name', names.getIn([id, 'name'], ''))
                .set('icon', names.getIn([id, 'icon'], ''))
                .set('tags', tags)
        })
    }
)
const patchedSkillDataSelector = createSelector(
    namedSkillDataSelector,
    mergedPatchDataSelector,
    (data, patch) => {
        return data.mergeWith(merger, patch).filter(skill => !skill.get('deleted', false))
    }
)
const elementSkillDataSelector = createSelector(
    patchedSkillDataSelector,
    buildElementSelector,
    (data, element) => {
        return data.filter(skill => skill.get('elementSpec', element) === element)
    }
)
const groupedSkillDataSelector = createSelector(elementSkillDataSelector, data => {
    data = data.sort((a, b) => {
        if (a.get('move', '') < b.get('move', '')) {
            return -1
        } else {
            return 1
        }
    })
    data = data.groupBy(skill => skill.get('groupId'))
    return data
})

const filteredSkillDataSelector = createSelector(
    groupedSkillDataSelector,
    groupDataSelector,
    filterSelector,
    searchSelector,
    buildElementSelector,
    buildSelector,
    (data, groupData, filter, search, element, build) => {
        data = data.filter(group => {
            let filterOK = filter === 'ALL'
            let searchOK = false

            group.forEach(skill => {
                let filterList = skill.get('filter', List())
                if (Map.isMap(filterList)) {
                    filterList = filterList.get(element, List())
                }

                filterOK = filterOK || filterList.includes(filter)
                searchOK =
                    searchOK ||
                    skill.get('name', '').toLowerCase().startsWith(search.trim().toLowerCase())
            })

            return filterOK && searchOK
        })
        groupData = groupData.map((group, id) => {
            return group
                .set('moves', data.get(id, Map()).toList())
                .set('currentMove', build.get(id, 1))
        })
        return groupData
    }
)

export const catagorizedSkillDataSelector = createSelector(
    filteredSkillDataSelector,
    viewSelector,
    (data, view) => {
        data = data.filter(group => group.get('moves', List()).size > 0)

        if (view.get('visibility', 'ALL') !== 'ALL') {
            data = data.filter(group => group.get('moves', List()).size > 1)
        }

        if (view.get('mode', 'LIST') === 'ICON' || view.get('order', 'LEVEL') === 'HOTKEY') {
            data = data
                .groupBy(group => group.get('hotkey'))
                .sortBy((value, key) => key, (a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
        } else {
            data = data
                .groupBy(group => group.get('minLevel'))
                .sortBy((value, key) => key, (a, b) => a - b)
        }

        return data.map(group =>
            group.sortBy((value, key) => key, (a, b) => a.substring(0, 5) - b.substring(0, 5))
        )
    }
)
