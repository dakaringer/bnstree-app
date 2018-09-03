import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

import {viewModes, visibility, order} from './actions'

const uiSelector = state => state.getIn([
    'trainer2', 'ui'
], Map())
const dataSelector = state => state.getIn([
    'trainer2', 'classData'
], Map())
const refSelector = state => state.getIn([
    'trainer2', 'ref'
], Map())
export const statSelector = state => state.getIn([
    'trainer2', 'character'
], Map())
const generalSelector = state => state.get('general', Map())

export const uiTextSelector = createSelector(generalSelector, ref => ref.get('uiText', Map()))

const tagOrderSelector = createSelector(generalSelector, ref => ref.getIn([
    'orders', 'SKILL_TAGS'
], List()))

//ui
export const classSelector = createSelector(uiSelector, state => state.get('classCode', ''))
export const modeSelector = createSelector(uiSelector, state => state.get('mode', 'SHOW_LIST'))
export const visibilitySelector = createSelector(uiSelector, state => state.get('visibility', 'SHOW_ALL'))
export const filterSelector = createSelector(uiSelector, state => state.get('filter', 'ALL'))
export const orderSelector = createSelector(uiSelector, state => state.get('order', 'KEY'))
export const keywordSelector = createSelector(uiSelector, state => state.get('keyword', ''))
export const currentTabSelector = createSelector(uiSelector, state => state.get('currentTab', ''))
export const loadingSelector = createSelector(uiSelector, state => state.get('loading', false))
export const patchSelector = createSelector(uiSelector, state => state.get('patch', 'BASE'))

//ref
export const templateSelector = createSelector(refSelector, ref => ref.get('templates', Map()))
export const constantSelector = createSelector(refSelector, ref => ref.get('constants', Map()))
export const tagsSelector = createSelector(refSelector, ref => ref.get('tags', Map()))
export const patchDataSelector = createSelector(refSelector, ref => ref.get('patchRef', Map()).sortBy((v,k) => k))
export const skillIconRefSelector = createSelector(refSelector, ref => ref.get('skillIcons', Map()))
export const skillNameRefSelector = createSelector(refSelector, ref => ref.get('skillNames', Map()))

//classData
const classDataSelector = createSelector(dataSelector, classSelector, (data, classCode) => data.get(classCode, Map()))
export const classElementSelector = createSelector(classDataSelector, data => data.get('elements', List()))
export const buildCatalogSelector = createSelector(classDataSelector, data => data.get('buildCatalog', Map()))
export const buildListSelector = createSelector(classDataSelector, data => data.get('builds', List()))
export const tabSelector = createSelector(buildListSelector, currentTabSelector, (data, tab) => data.get(tab, Map()))
export const currentElementSelector = createSelector(tabSelector, tab => tab.get('element'))

export const buildSelector = createSelector(tabSelector, currentElementSelector, (tab, element) => tab.getIn(['build', element], Map()))
export const buildFormatSelector = createSelector(classElementSelector, currentElementSelector, (data, element) => {
    return data.find(a => a.get('element') === element, null, Map()).get('buildFormat', List())
})

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

const prefixes = {
    BM: '20',
    KF: '21',
    FM: '22',
    DE: '24',
    AS: '25',
    SU: '26',
    BD: '27',
    WL: '28',
    SF: '(30|35)'
}

const currentPatchSelector = createSelector(patchSelector, patchDataSelector, (date, data) => {
    let patch = Map()
    if (date != 'BASE') {
        data = data.filter((v, k) => {
            return k <= date
        })
        data.forEach(d => {
            patch = patch.mergeWith(merger, d)
        })
    }
    return patch
})

const elementFilteredSkillListSelector = createSelector(classDataSelector, currentElementSelector, currentPatchSelector, classSelector, (data, element, patch, classCode) => {
    let list = data.get('skills', Map())
    if (patch.has('newSkills')) {
        patch.get('newSkills', Map()).forEach(s => {
            let id = s.get('_id')
            let reg = new RegExp(`^${prefixes[classCode]}.*`)
            if (reg.test(id)) {
                list = list.set(s.get('_id'), s)
            }
        })
    }

    list = list.map(x => {
        let types = x.get('types').filter(t => t.get('elementSpec', element) === element)
        return x.set('types', types)
    })

    return list
})

const skillListSelector = createSelector(elementFilteredSkillListSelector, skillIconRefSelector, skillNameRefSelector, currentElementSelector, tagsSelector, tagOrderSelector, buildSelector, currentPatchSelector, (list, icons, names, element, tags, tagOrder, build, patch) => {
    list = list.map((skill, id) => {
        let currentType = build.get(id, '0')
        let currentTypeArr = currentType.split('-')
        let currentTypeId = id

        let types = skill.get('types').map((type, i) => {
            let skillId = type.getIn(['traits', 'skillId'])
            let hmSkillId = type.getIn(['hmTraits', 'skillId'])

            if (patch.has('skills')) {
                if (patch.hasIn(['skills', id])) {
                    let patchData = patch.getIn(['skills', id, 'types', `${i+1}-${element}`], null)
                    if (!patchData) {
                        patchData = patch.getIn(['skills', id, 'types', (i+1).toString()], null)
                    }

                    if (patch.hasIn(['skills', id, 'hotkey'])) {
                        skill = skill.set('hotkey', patch.getIn(['skills', id, 'hotkey']))
                    }

                    if (patch.hasIn(['skills', id, 'minLevel'])) {
                        skill = skill.set('minLevel', patch.getIn(['skills', id, 'minLevel']))
                    }

                    if (patchData) {
                        type = type.mergeWith(merger, patchData)
                    }
                }
            }

            if (patch.has('deletedSkills')) {
                if (patch.get('deletedSkills', List()).find(v => v == skillId)) {
                    return null
                }
            }

            type = type.setIn(['traits', 'icon'], icons.get(skillId))
            type = type.setIn(['traits', 'name'], names.get(skillId))

            let attributes = type.getIn(['traits', 'attributes'], List()).filter(a => a.get('elementSpec', element) == element)
            let subAttributes = type.getIn(['traits', 'subAttributes'], List()).filter(a => a.get('elementSpec', element) == element)
            type = type.setIn(['traits', 'attributes'], attributes)
            type = type.setIn(['traits', 'subAttributes'], subAttributes)

            let t = type.getIn(['traits', 'tags'], List()).map((tag) => tags.get(tag, Map()).set('id', tag))
            type = type.setIn(['traits', 'tags'], t.sort((a, b) => tagOrder.indexOf(a.get('id')) - tagOrder.indexOf(b.get('id'))))

            if (hmSkillId) {
                type = type.setIn(['hmTraits', 'icon'], icons.get(hmSkillId))
                type = type.setIn(['hmTraits', 'name'], names.get(hmSkillId))

                let attributes = type.getIn(['hmTraits', 'attributes'], List()).filter(a => a.get('elementSpec', element) == element)
                let subAttributes = type.getIn(['hmTraits', 'subAttributes'], List()).filter(a => a.get('elementSpec', element) == element)
                type = type.setIn(['hmTraits', 'attributes'], attributes)
                type = type.setIn(['hmTraits', 'subAttributes'], subAttributes)

                let t = type.getIn(['hmTraits', 'tags'], List()).map((tag) => tags.get(tag, Map()).set('id', tag))
                type = type.setIn(['hmTraits', 'tags'], t.sort((a, b) => tagOrder.indexOf(a.get('id')) - tagOrder.indexOf(b.get('id'))))
            }

            if (i == currentTypeArr[0]) {
                if (currentTypeArr[1] && hmSkillId) {
                    currentTypeId = hmSkillId
                }
                else {
                    currentTypeId = skillId
                }
            }

            return type
        })

        let additionalInfo = Map({
            'icon': icons.get(currentTypeId),
            'name': names.get(currentTypeId)
        })

        types = types.filter(s => s)

        return skill.merge(additionalInfo).set('types', types)
    })
    list = list.filter(s => s.get('types', List()).size > 0)
    return list
})

function merger(a, b) {
    if (a && a.mergeWith && !List.isList(a) && !List.isList(b)) {
        return a.mergeWith(merger, b)
    }
    return b
}

const filterHighlightedSkillListSelector = createSelector(skillListSelector, filterSelector, currentElementSelector, keywordSelector, (list, filter, element, keyword) => {
    list = list.filter(x => {
        let filterSatisfied = false
        let searchSatisfied = false
        if (filter == 'ALL') {
            filterSatisfied = true
        }
        else {
            x.get('types', List()).forEach(y => {
                let filterList = y.get('filter', List())
                if (Map.isMap(filterList)) {
                    filterList = filterList.get(element, List())
                }

                filterSatisfied = filterSatisfied || filterList.includes(filter)

                searchSatisfied = keyword.trim() == '' || y.getIn(['traits', 'name'], '').toLowerCase().startsWith(keyword.toLowerCase())
            })
        }

        if (keyword.trim() == '') {
            searchSatisfied = true
        }
        else {
            x.get('types', List()).forEach(y => {
                searchSatisfied = searchSatisfied || keyword.trim() == '' || y.getIn(['traits', 'name'], '').toLowerCase().startsWith(keyword.toLowerCase())
            })
        }

        return filterSatisfied && searchSatisfied
    })

    return list.sortBy((value, key) => key, (a, b) => a - b).sort((a, b) => a.get('minLevel', 0) - b.get('minLevel', 0))
})

export const filteredSkillListSelector = createSelector(filterHighlightedSkillListSelector, modeSelector, visibilitySelector, orderSelector, (list, mode, currentVisibility, currentOrder) => {
    if (currentVisibility === visibility.SHOW_TRAINABLE) {
        list = list.filter(x => x.get('types', List()).size > 1)
    }

    if (mode == viewModes.SHOW_GRID) {
        list = list.groupBy(v => v.get('hotkey')).sortBy((value, key) => key, (a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
    }
    else {
        switch(currentOrder) {
            case order.HOTKEY:
                list = list.groupBy(v => v.get('hotkey')).sortBy((value, key) => key, (a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
                break
            case order.LEVEL:
                list = list.groupBy(v => v.get('minLevel')).sortBy((value, key) => key, (a, b) => a - b)
                break
        }
    }

    return list
})
