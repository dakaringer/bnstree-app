import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'

import {makeActionCreator, flatten} from '../../helpers'
import {setLoading, setViewOption} from '../../actions'
import {dataSelector, typeSelector} from './selectors'

const setType = makeActionCreator(actionType.ITEM_UI_SET_TYPE, 'itemType')
export const setSearch = makeActionCreator(actionType.ITEM_UI_SET_SEARCH, 'search')
export const setPatch = makeActionCreator(actionType.ITEM_UI_SET_PATCH, 'patch')

const setItemData = makeActionCreator(actionType.ITEM_DATA_SET_DATA, 'itemType', 'data')
const setItemPatchData = makeActionCreator(
    actionType.ITEM_DATA_SET_ITEM_PATCH_DATA,
    'itemType',
    'patch',
    'list'
)

const itemsQuery = q`query ($type: String!) {
    Items {
        itemData (type: $type)
        itemVotes (type: $type) {
            _id
            count
        }
        userVotes: userVotes(type: $type) {
            _id
            count
        }
    }
}`

const itemPatchQuery = q`query (
    $patch: Int!,
    $type: String!
) {
    Items {
        itemPatches(patch: $patch, type: $type) {
            patch
            data
        }
    }
}`

const voteMutation = q`mutation (
    $item: String!,
    $classCode: String!,
    $element: String!
) {
    Items {
        vote(
            item: $item,
            classCode: $classCode,
            element: $element
        )
    }
}`

const unvoteMutation = q`mutation (
    $item: String!,
    $classCode: String!,
    $element: String!
) {
    Items {
        unvote(
            item: $item,
            classCode: $classCode,
            element: $element
        )
    }
}`

export function loadItems(type) {
    return (dispatch, getState) => {
        dispatch(setType(type))
        dispatch(setSearch(''))
        dispatch(setPatch('BASE'))

        if (!dataSelector(getState()).has(type)) {
            dispatch(setLoading(true, 'items'))
        }
        apollo
            .query({
                query: itemsQuery,
                variables: {
                    type: type
                }
            })
            .then(json => {
                let data = {
                    data: flatten(json.data.Items.itemData)
                }
                if (type !== 'soulshield') {
                    data.voteData = flatten(json.data.Items.itemVotes)
                    data.userVoteData = flatten(json.data.Items.userVotes)
                }
                dispatch(setItemData(type, data))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'items')))
    }
}

export function vote(item, element, classCode, vote = true) {
    let mutation = vote ? voteMutation : unvoteMutation
    apollo
        .mutate({
            mutation: mutation,
            variables: {
                item: item,
                element: element,
                classCode: classCode
            },
            fetchPolicy: 'network-only'
        })
        .catch(e => console.error(e))
}

export function setFilter(filter) {
    return dispatch => {
        dispatch(setViewOption('itemFilter', filter))
    }
}

export function selectPatch(patch) {
    return (dispatch, getState) => {
        let type = typeSelector(getState())
        dispatch(setPatch(parseInt(patch, 10)))
        apollo
            .query({
                query: itemPatchQuery,
                variables: {
                    patch: patch,
                    type: type
                }
            })
            .then(json => {
                dispatch(setItemPatchData(type, patch, json.data.Items.itemPatches))
            })
            .catch(e => console.error(e))
    }
}
