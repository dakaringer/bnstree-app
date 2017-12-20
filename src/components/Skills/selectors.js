import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'

import {viewSelector} from '../../selectors'
import {patchListSelector, skillNamesSelector, skillNamesSelectorEN} from '../References/selectors'
import {characterSelector} from '../Character/selectors'

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

const charDataSelector = state => state.getIn(['skills', 'character'], Map())
export const dataSelector = state => state.getIn(['skills', 'data'], Map())
const buildDataSelector = state => state.getIn(['skills', 'build'], Map())

const characterBuildDataSelector = state => state.getIn(['character', 'data', 'skillData'], Map())

//ui
export const characterModeSelector = createSelector(uiSelector, state =>
    state.get('characterMode', false)
)
export const charSelector = createSelector(
    charDataSelector,
    characterModeSelector,
    characterSelector,
    (data, characterMode, characterStat) => {
        if (characterMode) {
            let totalStats = characterStat.getIn(['statData', 'total_ability'], Map())
            return fromJS({
                ap: totalStats.get('int_attack_power_value', 13),
                ad: totalStats.get('int_attack_damage_modify_diff', 0),
                c: 30,
                element: {
                    earth: totalStats.get('attack_attribute_earth_rate', 100),
                    flame: totalStats.get('attack_attribute_fire_rate', 100),
                    frost: totalStats.get('attack_attribute_ice_rate', 100),
                    lightning: totalStats.get('attack_attribute_lightning_rate', 100),
                    shadow: totalStats.get('attack_attribute_void_rate', 100),
                    wind: totalStats.get('attack_attribute_wind_rate', 100)
                }
            })
        }
        return data
    }
)

export const classSelector = createSelector(uiSelector, state => state.get('classCode', 'BM'))
export const filterSelector = createSelector(uiSelector, state => state.get('filter', 'ALL'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const patchSelector = createSelector(uiSelector, patchListSelector, (state, list) => {
    let currentPatch = state.get('patch', 'BASE')
    if (currentPatch === 'BASE') {
        currentPatch = list.find(p => p.get('base'), null, Map()).get('_id', '')
    }
    return currentPatch
})
export const basePatchSelector = createSelector(patchSelector, patchListSelector, (patch, list) =>
    list.find(p => p.get('base'), null, Map())
)

//data
const classDataSelector = createSelector(dataSelector, classSelector, (state, classCode) =>
    state.get(classCode, Map())
)
export const classElementDataSelector = createSelector(classDataSelector, state =>
    state.get('classData', List())
)
export const buildListSelector = createSelector(classDataSelector, state =>
    state.get('buildList', Map())
)
export const userBuildListSelector = createSelector(classDataSelector, state =>
    state.get('userBuildList', Map())
)

//build
export const characterElementSelector = createSelector(
    characterBuildDataSelector,
    classElementDataSelector,
    (characterBuild, elementData) => {
        let index = characterBuild.get('elementIndex', 0)
        return elementData.getIn([index, 'element'])
    }
)
export const buildElementSelector = createSelector(
    buildDataSelector,
    classSelector,
    characterModeSelector,
    characterElementSelector,
    (state, classCode, characterMode, characterElement) =>
        characterMode ? characterElement : state.getIn([classCode, 'element'])
)
export const buildSelector = createSelector(
    buildDataSelector,
    classSelector,
    buildElementSelector,
    characterModeSelector,
    characterBuildDataSelector,
    (state, classCode, element, characterMode, characterBuild) =>
        characterMode
            ? characterBuild.get('build', Map())
            : state.getIn([classCode, 'build', element], Map())
)

//patchData
const skillDataPatchSelector = createSelector(
    classDataSelector,
    patchSelector,
    classSelector,
    (data, patch, classCode) => {
        let list = Map()
        data
            .get('skillPatches', Map())
            .get(patch.toString(), List())
            .filter(patch => patch.get('skill'))
            .forEach(p => {
                let id = p.getIn(['skill', '_id'])
                let patch = list.getIn([id, 'patch'], p.get('patch'))
                if (patch <= p.get('patch')) {
                    list = list.set(id, p)
                }
            })
        return list
    }
)

const groupDataPatchSelector = createSelector(
    classDataSelector,
    patchSelector,
    classSelector,
    (data, patch, classCode) => {
        let list = Map()
        data = data
            .get('skillPatches', Map())
            .get(patch.toString(), List())
            .filter(patch => patch.get('skillGroup'))
            .forEach(p => {
                let id = p.getIn(['skillGroup', '_id'])
                let patch = list.getIn([id, 'patch'], p.get('patch'))
                if (patch <= p.get('patch')) {
                    list = list.set(id, p)
                }
            })
        return list
    }
)

export const namedPatchDataSelector = createSelector(
    skillDataPatchSelector,
    skillNamesSelector,
    skillNamesSelectorEN,
    (data, names, namesEN) => {
        data = data.map(patch => {
            let skill = patch.get('skill')
            let id = skill.get('skillId')
            let tags = skill.get('tags', List())
            tags = tags.sort((a, b) => tagOrder.indexOf(a) - tagOrder.indexOf(b))
            let name = names.get(id, namesEN.get(id, Map()))
            skill = skill
                .set('name', name.get('name', ''))
                .set('icon', name.get('icon', ''))
                .set('tags', tags)
            return patch.set('skill', skill)
        })
        return data.sort((a, b) => (a.getIn(['skill', '_id']) < b.getIn(['skill', '_id']) ? -1 : 1))
    }
)

//skillData
const groupDataSelector = createSelector(classDataSelector, data => data.get('groupData', Map()))

const patchedGroupDataSelector = createSelector(
    groupDataSelector,
    groupDataPatchSelector,
    (data, patchData) => {
        patchData.forEach(patch => {
            let group = patch.get('skillGroup')
            if (group) {
                let id = group.get('_id')
                data = data.set(id, group)
            }
        })
        return data
    }
)

const skillDataSelector = createSelector(classDataSelector, data => data.get('skillData', Map()))

export const namedSkillDataSelector = createSelector(
    skillDataSelector,
    skillNamesSelector,
    skillNamesSelectorEN,
    (data, names, namesEN) => {
        return data.map(skill => {
            let id = skill.get('skillId')
            let tags = skill.get('tags', List()) || List()
            tags = tags.sort((a, b) => tagOrder.indexOf(a) - tagOrder.indexOf(b))
            let name = names.getIn([id, 'name']) || namesEN.getIn([id, 'name'])
            return skill
                .set('name', name)
                .set('icon', names.getIn([id, 'icon'], ''))
                .set('tags', tags)
        })
    }
)

const patchedSkillDataSelector = createSelector(
    namedSkillDataSelector,
    namedPatchDataSelector,
    (data, patchData) => {
        patchData.forEach(patch => {
            let skill = patch.get('skill')
            let id = skill.get('_id')
            if (skill.size <= 7) {
                data = data.delete(id)
            } else {
                data = data.set(id, skill)
            }
        })
        return data
    }
)

const elementSkillDataSelector = createSelector(
    patchedSkillDataSelector,
    buildElementSelector,
    (data, element) => {
        return data.filter(skill => skill.get('elementSpec', element) === element)
    }
)

export const groupedSkillDataSelector = createSelector(elementSkillDataSelector, data => {
    data = data.sort((a, b) => a.get('move', 1) - b.get('move', 1))
    return data.groupBy(skill => skill.get('groupId'))
})

export const buildFormatSelector = createSelector(
    groupedSkillDataSelector,
    patchedGroupDataSelector,
    (data, groupData) => {
        data = groupData
            .map((group, id) => {
                return group.set('moves', data.get(id, Map()).toList())
            })
            .filter(group => group.get('moves', List()).size > 1)
            .toList()
            .sort((a, b) => {
                if (a.get('minLevel') === b.get('minLevel')) {
                    return a.get('_id') - b.get('_id')
                } else {
                    return a.get('minLevel') - b.get('minLevel')
                }
            })
            .map(skill => skill.get('_id'))

        return data
    }
)

const statSkillDataSelector = createSelector(
    groupedSkillDataSelector,
    classDataSelector,
    buildElementSelector,
    buildFormatSelector,
    (data, classData, element, buildFormat) => {
        let statData = classData.getIn(['statData', element], Map())
        let count = classData.getIn(['buildCount', element, 'count'], Map())
        let types = ['PvE', 'PvP', '6v6']

        data = data.map(group => {
            group = group.map(skill => {
                let id = skill.get('groupId')
                if (buildFormat.includes(id)) {
                    types.forEach(t => {
                        let hm = skill.get('move') > 3
                        skill = skill.setIn(
                            ['buildStat', t, hm ? 'hm' : 'basic'],
                            statData
                                .getIn(['types', t, id], Map())
                                .find(s => s.get('move', 1) === skill.get('move'), null, Map())
                                .get('count', 0)
                        )
                        let offset = hm ? -3 : 3
                        skill = skill.setIn(
                            ['buildStat', t, hm ? 'basic' : 'hm'],
                            statData
                                .getIn(['types', t, id], Map())
                                .find(
                                    s => s.get('move', 1) === skill.get('move') + offset,
                                    null,
                                    Map()
                                )
                                .get('count', 0)
                        )
                    })
                    skill = skill.setIn(['buildStat', 'total'], count)
                }

                return skill
            })

            return group
        })

        return data
    }
)

const filteredSkillDataSelector = createSelector(
    statSkillDataSelector,
    patchedGroupDataSelector,
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
                if (skill.get('name')) {
                    searchOK =
                        searchOK ||
                        skill
                            .get('name', '')
                            .toLowerCase()
                            .startsWith(search.trim().toLowerCase())
                }
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
    characterModeSelector,
    (data, view, characterMode) => {
        data = data.filter(group => group.get('moves', List()).size > 0)

        if (view.get('skillVisibility', 'ALL') !== 'ALL' || characterMode) {
            data = data.filter(group => group.get('moves', List()).size > 1)
        }

        if (
            view.get('skillMode', 'LIST') === 'ICON' ||
            view.get('skillOrder', 'LEVEL') === 'HOTKEY'
        ) {
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
