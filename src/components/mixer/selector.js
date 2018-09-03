import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const uiSelector = state => state.getIn([
    'mixer', 'ui'
], Map())
export const dataSelector = state => state.getIn([
    'mixer', 'data'
], Map())
export const tabSelector = state => state.getIn([
    'mixer', 'tabs'
], List())
const refSelector = state => state.getIn([
    'mixer', 'ref'
], Map())
const generalSelector = state => state.get('general', Map())

export const uiTextSelector = createSelector(generalSelector, ref => ref.get('uiText', Map()))

//ui
export const classSelector = createSelector(uiSelector, state => state.get('classCode', ''))
export const filterSelector = createSelector(uiSelector, state => state.get('filter', 'ALL'))
export const keywordSelector = createSelector(uiSelector, state => state.get('keyword', ''))
export const currentTabSelector = createSelector(uiSelector, state => state.get('currentTab', ''))

//ref
export const templateSelector = createSelector(refSelector, ref => ref.get('templates', Map()))
export const locationSelector = createSelector(refSelector, ref => ref.get('locations', Map()))
export const skillSelector = createSelector(refSelector, ref => ref.get('skills', Map()))

//tabs
export const equipDataSelector = createSelector(tabSelector, currentTabSelector, (tabs, index) => {
    return tabs.get(index, List())
})

const legendarySets = [
    'VT',
    'BT',
    'MSP',
    'WW',
    'none'
]

export const filteredListSelector = createSelector(dataSelector, classSelector, filterSelector, keywordSelector, (data, c, set, keyword) => {
    data = data.toOrderedMap().sortBy((value, key) => [value, key], (a, b) => {
        let x = legendarySets.indexOf(a[0].get('set', 'none'))
        let y = legendarySets.indexOf(b[0].get('set', 'none'))
        if (x == y) {
            if (x != legendarySets.length - 1) {
                return a[1] - b[1]
            }
            else {
                let l1 = a[0].get('level', 0)
                let l2 = b[0].get('level', 0)
                if (l1 == l2) {
                    return b[1] - a[1]
                }
                else {
                    return l2 - l1
                }
            }
        }
        else {
            return x - y
        }
    }).filter(s => {
        if (c !== 'ALL' && s.has('classRestriction') && s.get('classRestriction') !== c) {
            return false
        }
        if (set !== 'ALL' && s.get('set') !== set) {
            return false
        }
        if (keyword.trim() != '' && !s.get('name').toLowerCase().includes(keyword.trim().toLowerCase())) {
            return false
        }
        return true
    })
    return data
})

export const statOrder = [
    'critical',
    'criticalDamage',
    'accuracy',
    'health',
    'defense',
    'evasion',
    'block',
    'criticalDefense'
]
