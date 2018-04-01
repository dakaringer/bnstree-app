import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

import {viewSelector} from '../../selectors'
import {itemNamesSelector, itemNamesSelectorEN, patchListSelector} from '../References/selectors'

const classOrder = ['BM', 'KF', 'DE', 'FM', 'AS', 'SU', 'BD', 'WL', 'SF', 'SH']

const badgeTypeOrder = ['soul', 'mystic']
const soulshieldTypeOrder = ['PvE', '6v6', 'heroic']

const soulBadgeOrder = ['legendary', 'lime', 'orange', 'purple', 'blue', 'green', 'red', 'yellow']
const mysticBadgeOrder = ['legendary', 'yellow', 'red']

const uiSelector = state => state.getIn(['items', 'ui'], Map())
export const dataSelector = state => state.getIn(['items', 'data'], Map())

//ui
export const typeSelector = createSelector(uiSelector, state => state.get('type', 'badge'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const patchSelector = createSelector(uiSelector, patchListSelector, (state, list) => {
    let currentPatch = state.get('patch', 'BASE')
    if (currentPatch === 'BASE') {
        currentPatch = list.find(p => p.get('base'), null, Map()).get('_id', '')
    }
    return currentPatch
})

//data
const itemDataSelector = createSelector(dataSelector, typeSelector, (state, type) =>
    state.get(type, Map())
)

const itemDataPatchSelector = createSelector(itemDataSelector, patchSelector, (data, patch) => {
    let list = Map()
    data
        .get('patchData', Map())
        .get(patch.toString(), List())
        .forEach(p => {
            let id = p.getIn(['data', '_id'])
            let patch = list.getIn([id, 'patch'], p.get('patch'))
            if (patch <= p.get('patch')) {
                list = list.set(id, p)
            }
        })
    return list
})

export const namedPatchDataSelector = createSelector(
    itemDataPatchSelector,
    itemNamesSelector,
    itemNamesSelectorEN,
    (data, names, namesEN) => {
        data = data.map(patch => {
            let item = patch.get('data')
            let id = item.get('name')
            let name = names.get(id, namesEN.get(id, Map()))
            item = item.set('name', name.get('name', '')).set('icon', name.get('icon', ''))
            return patch.set('data', item)
        })
        return data.sort((a, b) => (a.getIn(['data', '_id']) < b.getIn(['data', '_id']) ? -1 : 1))
    }
)

const namedItemDataSelector = createSelector(
    itemDataSelector,
    itemNamesSelector,
    itemNamesSelectorEN,
    (data, names, namesEn) => {
        let itemData = data.get('data', Map()).map((item, key) => {
            let voteData = data.getIn(['voteData', key, 'count'], Map())
            item = item.set('voteData', voteData)

            let id = item.get('name')
            let name = names.getIn([id, 'name']) || item.getIn([id, 'name'])
            item = item.set('name', name).set('icon', names.getIn([id, 'icon'], ''))

            return item
        })

        return itemData
    }
)

const patchedItemDataSelector = createSelector(
    namedItemDataSelector,
    namedPatchDataSelector,
    (data, patchData) => {
        patchData.forEach(patch => {
            let item = patch.get('data')
            let id = item.get('_id')
            data = data.set(id, item)
        })
        return data
    }
)

const processedItemDataSelector = createSelector(
    patchedItemDataSelector,
    itemNamesSelector,
    itemNamesSelectorEN,
    (data, names, namesEn) => {
        let itemData = data.map((item, key) => {
            if (item.has('combine')) {
                let enhance = List()
                let attributes = List()
                let combine = List()
                item.get('combine').forEach(badgeId => {
                    let badgeOther = data.get(badgeId, Map())
                    attributes = attributes.concat(badgeOther.get('attributes'))
                    enhance = enhance.concat(badgeOther.get('enhance'))
                    combine = combine.push(
                        Map({
                            icon: badgeOther.get('icon'),
                            name: badgeOther.get('name')
                        })
                    )
                })

                item = item
                    .set('enhance', enhance)
                    .set('attributes', attributes)
                    .set('combine', combine)
            }
            return item
        })

        return itemData
    }
)

const filteredItemDataSelector = createSelector(
    processedItemDataSelector,
    viewSelector,
    searchSelector,
    (data, view, search) => {
        let filter = view.get('itemFilter', 'ALL')
        if (filter !== 'ALL') {
            data = data.filter(item => {
                let classCode = item.get('classCode', 'ALL')
                return classCode === 'ALL' || classCode === filter
            })
        }
        if (search.trim() !== '') {
            data = data.filter(item =>
                item
                    .get('name', '')
                    .toLowerCase()
                    .startsWith(search.toLowerCase())
            )
        }
        return data
    }
)

export const sortedItemDataSelector = createSelector(
    filteredItemDataSelector,
    typeSelector,
    (data, itemType) => {
        let typeOrder = []
        switch (itemType) {
            case 'badge':
                typeOrder = badgeTypeOrder
                break
            case 'soulshield':
                typeOrder = soulshieldTypeOrder
                break
            default:
                typeOrder = []
        }

        data = data
            .groupBy(b => b.get('type'))
            .map((type, key) =>
                type.sort((a, b) => {
                    let groupOrder = []
                    if (itemType === 'badge') {
                        groupOrder = key === 'soul' ? soulBadgeOrder : mysticBadgeOrder
                    }

                    let order =
                        groupOrder.indexOf(a.get('group')) - groupOrder.indexOf(b.get('group'))
                    if (order === 0) {
                        order = b.get('index') - a.get('index')
                    }
                    if (order === 0) {
                        order =
                            classOrder.indexOf(a.get('classCode')) -
                            classOrder.indexOf(b.get('classCode'))
                    }

                    return order
                })
            )
            .sortBy((value, key) => key, (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b))

        return data
    }
)

export const userVoteDataSelector = createSelector(itemDataSelector, data =>
    data.get('userVoteData', Map())
)
