import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

import {skillIconRefSelector, skillNameRefSelector, tagsSelector} from '../trainer2/selector'

const uiSelector = state => state.getIn([
    'character', 'ui'
], Map())

export const characterSelector = state => state.getIn([
    'character', 'data'
], Map())

const generalSelector = state => state.get('general', Map())

export const uiTextSelector = createSelector(generalSelector, ref => ref.get('uiText', Map()))

export const regionSelector = createSelector(uiSelector, state => state.get('region', 'na'))
export const tabSelector = createSelector(uiSelector, state => state.get('tab', 'profile'))
export const visibilitySelector = createSelector(uiSelector, state => state.get('visibility', 'SHOW_ALL'))

const skillDataSelector = state => state.getIn([
    'trainer2', 'classData'
], Map())

const tagOrderSelector = createSelector(generalSelector, ref => ref.getIn([
    'orders', 'SKILL_TAGS'
], List()))

export const classSkillDataSelector = createSelector(skillDataSelector, characterSelector, skillIconRefSelector, skillNameRefSelector, tagsSelector, tagOrderSelector, visibilitySelector, (data, character, icons, names, tags, tagOrder, showAll) => {
    let classCode = character.getIn(['general', 'classCode'])
    let classData = data.get(classCode)

    let elementIndex = character.getIn(['skillData', 'elementIndex'], 0)
    let element = classData.getIn(['elements', elementIndex, 'element'])

    let list = classData.get('skills', Map())
    list = list.map(x => {
        let types = x.get('types').filter(t => t.get('elementSpec', element) === element)

        return x.set('types', types)
    })

    if (showAll) {
        list = list.filter(s => s.get('types', List()).size > 0)
    }
    else {
        list = list.filter(s => s.get('types', List()).size > 1)
    }

    let trainingData = character.getIn(['skillData', 'skills'], List())

    let temp = []
    trainingData.forEach(s => temp.push(s.get('skill_id')))

    list = list.map((skill, id) => {
        let trainingSkill = trainingData.find(s => s.get('skill_id') == id, null, Map())

        let variationIndex = trainingSkill.get('variation_index', 11).toString()

        let currentType = variationIndex[1] - 1
        let currentTypeId = id

        let types = skill.get('types').map((type, i) => {
            let skillId = type.getIn(['traits', 'skillId'])
            let hmSkillId = type.getIn(['hmTraits', 'skillId'])

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

            if (i == currentType) {
                if (variationIndex[1] >= 5  && hmSkillId) {
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
            'name': names.get(currentTypeId),
            'variationIndex': variationIndex
        })

        return skill.merge(additionalInfo).set('types', types)
    })

    list = list.sortBy((value, key) => key, (a, b) => a - b).groupBy(v => v.get('minLevel')).sortBy((value, key) => key, (a, b) => a - b)
    return {
        list: list,
        element: element
    }
})
