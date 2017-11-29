import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

import {currentLanguageSelector, viewSelector} from '../../selectors'

const classOrder = ['BM', 'KF', 'DE', 'FM', 'AS', 'SU', 'BD', 'WL', 'SF', 'SH']

const badgeTypeOrder = ['soul', 'mystic']
const soulshieldTypeOrder = ['PvE', '6v6', 'heroic']

const soulBadgeOrder = ['legendary', 'lime', 'orange', 'purple', 'blue', 'green', 'red', 'yellow']
const mysticBadgeOrder = ['legendary', 'yellow', 'red']

const uiSelector = state => state.getIn(['items', 'ui'], Map())
export const dataSelector = state => state.getIn(['items', 'data'], Map())
export const refSelector = state => state.getIn(['items', 'ref'], Map())

//ui
export const typeSelector = createSelector(uiSelector, state => state.get('type', 'badges'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const patchSelector = createSelector(uiSelector, state => state.get('patch', 'BASE'))

//ref
export const skillNamesSelector = createSelector(
    refSelector,
    currentLanguageSelector,
    (state, language) =>
        state.getIn(['skillNames', language], state.getIn(['skillNames', 'en'], Map()))
)
export const skillNamesSelectorEN = createSelector(refSelector, state =>
    state.getIn(['skillNames', 'en'], Map())
)
const itemNamesSelector = createSelector(refSelector, currentLanguageSelector, (state, language) =>
    state.getIn(['itemNames', language], Map())
)
const itemNamesSelectorEN = createSelector(refSelector, state =>
    state.getIn(['itemNames', 'en'], Map())
)

//data
const itemDataSelector = createSelector(dataSelector, typeSelector, (state, type) =>
    state.get(type, Map())
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

const processedItemDataSelector = createSelector(
    namedItemDataSelector,
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
        let filter = view.get('itemFilter', Map())
        let checked = false
        filter.forEach(check => {
            checked = check || checked
        })
        if (checked) {
            data = data.filter(item => {
                let classCode = item.get('classCode', 'ALL')
                return classCode === 'ALL' || filter.get(classCode, false)
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
            case 'badges':
                typeOrder = badgeTypeOrder
                break
            case 'soulshields':
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
                    if (itemType === 'badges') {
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
