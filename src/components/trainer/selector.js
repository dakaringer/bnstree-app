import {createSelector} from 'reselect'
import {getLearned, calculateUsedPoints, calculateMaxPoints, calculateUsedPointsSkill} from './calc'
import {Map, List} from 'immutable'

import {visibilityFilters} from './actions'
import {learned, lastValid, getElement} from './calc'

const regex = /(\d+)/

//const trainerSelector = state => state.get('trainer', Map())
const uiSelector = state => state.getIn([
    'trainer', 'ui'
], Map())
const dataSelector = state => state.getIn([
    'trainer', 'jobData'
], Map())
const refSelector = state => state.getIn([
    'trainer', 'ref'
], Map())
export const statSelector = state => state.getIn([
    'trainer', 'character'
], Map())
const generalSelector = state => state.getIn(['general'], Map())

const attributesSelector = createSelector(refSelector, ref => ref.get('attributes', Map()))
const subAttributesSelector = createSelector(refSelector, ref => ref.get('subAttributes', Map()))
export const uiTextSelector = createSelector(generalSelector, ref => ref.get('uiText', Map()))
export const variableSelector = createSelector(refSelector, ref => ref.get('variables', Map()))
export const tagsSelector = createSelector(refSelector, ref => ref.get('tags', Map()))
const tagOrderSelector = createSelector(generalSelector, ref => ref.getIn([
    'orders', 'SKILL_TAGS'
], List()))
export const patchRefSelector = createSelector(refSelector, ref => ref.get('patchRef', Map()))

export const loadingSelector = createSelector(uiSelector, state => state.get('loading', false))
export const jobSelector = createSelector(uiSelector, state => state.get('job', ''))
export const currentSkillSelector = createSelector(uiSelector, state => state.get('currentSkill', ''))
export const currentTreeSelector = createSelector(uiSelector, state => state.get('currentTree', ''))
export const currentTabSelector = createSelector(uiSelector, state => state.get('currentTab', ''))
export const modeSelector = createSelector(uiSelector, state => state.get('mode', ''))
export const visibilitySelector = createSelector(uiSelector, state => state.get('visibility', ''))
export const keywordSelector = createSelector(uiSelector, state => state.get('keyword', ''))
const tempSelector = createSelector(uiSelector, state => state.get('hoverNode'))

const jobOrderSelector = createSelector(generalSelector, ref => ref.getIn([
    'orders', 'JOBS'
], List()))
export const jobTextSelector = createSelector(generalSelector, jobOrderSelector, (ref, order) => {
    let names = ref.getIn([
        'uiText', 'JOB_NAMES'
    ], Map())

    return names.map((val, key) => {
        return {id: key, name: val}
    }).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
})

const jobDataSelector = createSelector(dataSelector, jobSelector, (data, job) => data.get(job, Map()))
export const buildsSelector = createSelector(jobDataSelector, data => data.get('builds', List()))
export const tabSelector = createSelector(buildsSelector, currentTabSelector, (data, tab) => data.get(tab, Map()))

export const levelSelector = createSelector(tabSelector, tab => ({
    level: tab.get('level', 0),
    hLevel: tab.get('hLevel', 0)
}))

export const skillIconRefSelector = createSelector(refSelector, ref => ref.get('icons', null))
export const skillNameRefSelector = createSelector(refSelector, ref => ref.get('names', null))
export const buildSelector = createSelector(tabSelector, tab => tab.get('build', Map()))

export const patchSelector = createSelector(buildSelector, build => build.get('patch', 'BASE'))

export const treeDataSelector = createSelector(jobDataSelector, data => data.get('tree', Map()))
const currentTreeDataSelector = createSelector(treeDataSelector, currentTreeSelector, (data, id) => data.get(id, Map()))
export const sharedTreeSelector = createSelector(currentTreeDataSelector, data => data.get('sharedTree', null))
export const rawNodesSelector = createSelector(currentTreeDataSelector, data => data.get('nodes', Map()))
export const nodesSelector = createSelector(rawNodesSelector, skillIconRefSelector, skillNameRefSelector, (data, icons, names) => {
    return data.map((item, key) => {

        let refId = item.get('iconTextOverride', item.get('skillId'))

        let additionalInfo = Map({
            'icon': icons.get(refId, null),
            'name': names.get(refId, null),
            'pos': key
        })

        return item.merge(additionalInfo).sortBy((value, key) => ({pos: key}), (a, b) => a.key - b.key)
    })
})
//const defaultStatusSelector = createSelector(currentTreeDataSelector, currentSkillSelector, (data, id) => data.getIn(['rootNodes', id], '0'))
export const treeStatusSelector = createSelector(buildSelector, currentTreeSelector, sharedTreeSelector, (build, id, sharedId) => build.get(sharedId || id, '0'))
export const learnedSelector = createSelector(nodesSelector, treeStatusSelector, getLearned)

export const allTagsSelector = createSelector(rawNodesSelector, currentTreeDataSelector, treeDataSelector, treeStatusSelector, tagsSelector, tagOrderSelector, buildSelector, (nodes, tree, allTrees, pos, tags, order, build) => {
    let tagIDs = List()
    let currentTagIDs = List()

    if (tree.has('altNode')) {
        let id = tree.getIn(['altNode', 'skill'])
        let depTreeNodes = allTrees.getIn([
            id, 'nodes'
        ], Map())
        let status = build.get(id, '0')
        tree.getIn(['altNode', 'alt']).forEach((p) => {
            if (learned(depTreeNodes, status, p.get('pos', '0'))) {
                pos = p.get('node', '0')
                return false
            }
        })
    }

    nodes.forEach((node, key) => {
        if (!node.has('locked')) {
            let nodeTagIDs = node.get('tags', List())
            tagIDs = tagIDs.concat(nodeTagIDs)
            if (pos == key) {
                currentTagIDs = nodeTagIDs
            }
        }
    })

    if (tree.has('rootNodes')) {
        let treeId = nodes.getIn(['0', 'skillId'])
        let defaultPos = lastValid(nodes, pos, treeId)
        currentTagIDs = currentTagIDs.concat(nodes.getIn([defaultPos, 'tags']))

        tree.get('rootNodes').forEach((n, id) => {
            let p = lastValid(nodes, regex.exec(n)[0], id) || '0'
            if (learned(nodes, pos, p)) {
                currentTagIDs = currentTagIDs.concat(nodes.getIn([n, 'tags']))
            }
        })
    }

    tagIDs = tagIDs.toSet().toList().map((tagID) => {
        let additionalInfo = Map({
            'id' : tagID,
            'flag' : currentTagIDs.includes(tagID)
                ? ''
                : 'disabled'
        })

        return tags.get(tagID, Map()).merge(additionalInfo)
    })
    return tagIDs.sort((a, b) => order.indexOf(a.get('id')) - order.indexOf(b.get('id')))
})

const attbSelector = createSelector(nodesSelector, attributesSelector, subAttributesSelector, tagsSelector, tagOrderSelector, (nodes, templates, conditions, tags, order) => {
    return nodes.map((node) => {
        let attributes = node.get('attributes', List()).map((attb) => {
            let temp = templates.get(attb.get('type'), '')
            return attb.set('template', temp)
        })

        let subAttributes = node.get('subAttributes', List()).map((subAttb) => {
            let temp = conditions.get(subAttb.get('type'), '')
            return subAttb.set('template', temp)
        })

        let t = node.get('tags', List()).map((tag) => {
            return tags.get(tag, Map()).set('id', tag)
        })

        let additionalInfo = Map({
            'attributes' : attributes,
            'subAttributes' : subAttributes,
            'tags' : t.sort((a, b) => order.indexOf(a.get('id')) - order.indexOf(b.get('id')))
        })
        return node.merge(additionalInfo)
    })
})

export const tooltipSelector = createSelector(attbSelector, currentSkillSelector, treeStatusSelector, tempSelector, currentTreeDataSelector, treeDataSelector, buildSelector, (nodes, skillId, pos, tempPos, tree, allTrees, build) => {
    let nodeSkillId = nodes.getIn([pos, 'skillId'])

    if (tempPos) {
        let tempSkillId = regex.exec(nodes.getIn([
            tempPos, 'skillId'
        ], ''))[0]
        if (tempSkillId != skillId) {
            pos = lastValid(nodes, pos, tempSkillId)
        } else {
            pos = lastValid(nodes, pos, skillId)
        }
        if (!pos) {
            pos = tree.getIn(['rootNodes', tempSkillId]) || '0'
        }
    } else if (tree.has('altNode')) {
        let id = tree.getIn(['altNode', 'skill'])
        let depTreeNodes = allTrees.getIn([
            id, 'nodes'
        ], Map())
        let status = build.get(id, '0')
        tree.getIn(['altNode', 'alt']).forEach((p) => {
            if (learned(depTreeNodes, status, p.get('pos', '0'))) {
                pos = p.get('node', '0')
                return false
            }
        })
    } else if (nodeSkillId != skillId) {
        pos = lastValid(nodes, pos, skillId)
        if (!pos) {
            pos = tree.getIn(['rootNodes', skillId]) || '0'
        }
    }
    return nodes.get(pos, Map())
})
export const tempTooltipSelector = createSelector(attbSelector, tempSelector, (nodes, tempPos) => nodes.get(tempPos, null))

const order = [
    'LB',
    'RB',
    'F',
    'Tab',
    '1',
    '2',
    '3',
    '4',
    'Z',
    'X',
    'C',
    'V',
    'Q',
    'E',
    'S',
    'Familiar',
    'Passive',
    'None'
]
export const rawListDataSelector = createSelector(jobDataSelector, data => data.get('list', Map()))
export const minLevelSelector = createSelector(rawListDataSelector, currentSkillSelector, (data, id) => data.getIn([id, 'minLevel']))
const filteredNamesSelector = createSelector(skillNameRefSelector, keywordSelector, (names, keyword) => {
    return names.filter((name) => {
        if (name) {
            return name.toLowerCase().startsWith(keyword.toLowerCase())
        }
    })
})

export const listDataSelector = createSelector(rawListDataSelector, currentSkillSelector, skillIconRefSelector, skillNameRefSelector, buildSelector, treeDataSelector, tagsSelector, (data, currentSkill, icons, names, build, trees, tags) => {
    return data.map((item, key) => {
        let treeId = item.get('treeId', null)
        let id = treeId
            ? treeId
            : key

        let nodes = trees.getIn([
            id, 'nodes'
        ], Map())
        let status = build.get(id, '0')
        let validPos = lastValid(nodes, status, key)
        let refId = trees.getIn([
            id, 'nodes', validPos, 'skillId'
        ], id)

        if (trees.hasIn([id, 'altNode'])) {
            let depId = trees.getIn([id, 'altNode', 'skill'])
            let depTreeNodes = trees.getIn([
                depId, 'nodes'
            ], Map())
            let status = build.get(depId, '0')
            trees.getIn([id, 'altNode', 'alt']).forEach((p) => {
                if (learned(depTreeNodes, status, p.get('pos', '0'))) {
                    validPos = p.get('node', '0')
                    refId = nodes.getIn([validPos, 'skillId'])
                    return false
                }
            })
        }

        if (trees.hasIn([id, 'sharedTree'])) {
            status = build.get(trees.getIn([id, 'sharedTree']), '0')
        }

        if (!validPos && trees.hasIn([id, 'rootNodes', key])) {
            validPos = trees.getIn([id, 'rootNodes', key])
        }

        let element = []
        let attb = trees.getIn([
            id, 'nodes', validPos, 'attributes'
        ], List())
        attb.forEach((a) => {
            let e = getElement(a.getIn([
                'var', 'damage'
            ], null), trees, build)
            if (e && element.indexOf(e) == -1) {
                element.push(e)
            }
        })

        let children = trees.getIn([
            treeId, 'nodes', status, 'children'
        ], null)
        let filled = true
        if (children && List.isList(children)) {
            children.forEach((i) => {
                filled = trees.hasIn([id, 'nodes', i, 'locked'])
                if (!filled) {
                    return false
                }
            })
        }

        if (!key.startsWith(id) && !refId.startsWith(key)) {
            let rootNode = trees.getIn([
                id, 'rootNodes', key
            ], '0')
            validPos = nodes.hasIn([rootNode, 'learned'])
                ? rootNode
                : learned(nodes, status, regex.exec(rootNode)[0])
            refId = key
        }
        let disabled = !validPos && !trees.hasIn([id, 'nodes', '0', 'learned']) || trees.hasIn([id, 'nodes', validPos, 'disabled'])

        let t = List()
        nodes.forEach((node) => {
            node.get('tags', List()).map((tag) => {
                return tags.get(tag, Map()).set('id', tag)
            }).forEach((tag) => {
                let name = tag.get('name', '')
                if (!t.includes(name)) {
                    t = t.push(name.toLowerCase())
                }
            })
        })

        let usedPoints = null
        if (treeId && trees.hasIn([treeId, 'nodes'])) {
            usedPoints = calculateUsedPointsSkill(trees.getIn([treeId, 'nodes']), status)
        }

        let additionalInfo = Map({
            'icon': icons.get(refId, null),
            'name': names.get(refId, null),
            'selected': key == currentSkill,
            'disabled': disabled,
            'status' : status,
            'elements': element,
            'tags': t,
            'filled': filled,
            'usedPoints': usedPoints
        })

        //return item.set('icon', icons.get(refId, null)).set('name', names.get(refId, null)).set('selected', key == currentSkill).set('disabled', disabled).set('elements', element).set('tags', t).set('filled', filled).set('usedPoints', usedPoints)
        return item.merge(additionalInfo)
    })
})

export const firstListIdSelector = createSelector(listDataSelector, (data) => {
    return data.sortBy((value, key) => ({id: key, lv: value.get('minLevel')}), (a, b) => {
        let r = a.lv - b.lv
        if (r == 0) {
            r = a.id - b.id
        }
        return r
    }).groupBy(v => v.get('hotkey')).sortBy((value, key) => key, (a, b) => order.indexOf(a) - order.indexOf(b)).first().keySeq().first()
})

export const filteredListDataSelector = createSelector(filteredNamesSelector, visibilitySelector, listDataSelector, keywordSelector, (names, visibility, data, keyword) => {
    return data.filter((item, id) => {
        if (visibility === visibilityFilters.SHOW_TRAINABLE && !item.get('treeId')) {
            return false
        }
        let found = false
        item.get('tags', List()).forEach(val => {
            if (val.startsWith(keyword.toLowerCase())) {
                found = true
                return false
            }
        })
        names.forEach((val, key) => {
            if (key.startsWith(id)) {
                found = true
                return false
            }
        })
        return found
    }).sortBy((value, key) => ({id: key, lv: value.get('minLevel')}), (a, b) => {
        let r = a.lv - b.lv
        if (r == 0) {
            r = a.id - b.id
        }
        return r
    }).groupBy(v => v.get('hotkey')).sortBy((value, key) => key, (a, b) => order.indexOf(a) - order.indexOf(b))
})

export const maxPointsSelector = createSelector(levelSelector, level => calculateMaxPoints(level.level, level.hLevel))
export const usedPointsSelector = createSelector(treeDataSelector, buildSelector, calculateUsedPoints)
export const usedPointsSkillSelector = createSelector(rawNodesSelector, treeStatusSelector, calculateUsedPointsSkill)

export const buildListSelector = createSelector(jobDataSelector, data => data.get('buildList', Map()))
