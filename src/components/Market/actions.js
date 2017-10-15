import * as actionType from './actionTypes'
import {makeActionCreator} from '../../helpers'
import apollo, {q} from '../../apollo'

import {setViewOption} from '../../actions'
import {viewSelector} from '../../selectors'
import {dataSelector} from './selectors'

//Action creators
const setSearch = makeActionCreator(actionType.SET_MARKET_SEARCH, 'search')
const setSuggestions = makeActionCreator(actionType.SET_MARKET_SUGGESTIONS, 'list')
const setBookmarks = makeActionCreator(actionType.SET_MARKET_BOOKMARKS, 'list')
const setPopularItems = makeActionCreator(actionType.SET_MARKET_POPULAR_ITEMS, 'list')
export const setGraph = makeActionCreator(actionType.SET_MARKET_GRAPH, 'graph')
export const setTerm = makeActionCreator(actionType.SET_MARKET_TERM, 'term')
export const setIndicator = makeActionCreator(
    actionType.SET_MARKET_GRAPH_INDICATOR,
    'value',
    'indicator'
)
const setUpdate = makeActionCreator(actionType.SET_MARKET_LAST_UPDATE, 'value')
const setMarketLoading = makeActionCreator(actionType.SET_MARKET_LOADING, 'loading')

export const setData = makeActionCreator(actionType.SET_MARKET_DATA, 'itemData')

const popularItemsQuery = q`query ($region: String!) {
    Market {
        popular(region: $region) {
            item {
                _id
                name
                grade
                icon
            }
            priceData: price {
                items
            }
        }
    }
}`

const suggestionQuery = q`query ($query: String!) {
    Market {
        suggestion(query: $query) {
            _id
            name
            grade
            icon
        }
    }
}`

const itemQuery = q`query (
    $query: String,
    $region: String!,
    $exact: Boolean
    $itemId: Int
) {
    Market {
        search(
            query: $query,
            region: $region,
            exact: $exact,
            itemId: $itemId
        ) {
            item {
                _id
                name
                grade
                icon
            }
            priceData: price {
                items
            }
            bookmarked
        }
    }
}`

const bookmarksQuery = q`query ($region: String!) {
    Market {
        bookmarks(region: $region) {
            item {
                _id
                name
                grade
                icon
            }
            priceData: price {
                items
            }
        }
    }
}`

const bookmarkOrderMutation = q`mutation ($order: [String]!) {
    Market {
        reorderBookmarks (order: $order)
    }
}`

const createBookmarkMutation = q`mutation ($itemId: Int!) {
    Market {
        createBookmark(itemId: $itemId)
    }
}`

const deleteBookmarkMutation = q`mutation ($itemId: Int!) {
    Market {
        deleteBookmark(itemId: $itemId)
    }
}`

export function loadPopularItems() {
    return (dispatch, getState) => {
        let region = viewSelector(getState()).get('marketRegion', 'na')

        apollo
            .query({
                query: popularItemsQuery,
                variables: {
                    region: region
                }
            })
            .then(json => {
                dispatch(setPopularItems(json.data.Market.popular))
            })
            .catch(e => console.error(e))
    }
}

export function updateRegion(region) {
    return (dispatch, getState) => {
        dispatch(setViewOption('marketRegion', region))
        dispatch(loadPopularItems())
        dispatch(loadBookmarks())

        let item = dataSelector(getState())
        if (item.get('item')) {
            dispatch(loadItem(item.getIn(['item', '_id'])))
        }
    }
}

export function search(term) {
    return dispatch => {
        dispatch(setSearch(term))
        if (term.length >= 2) {
            apollo
                .query({
                    query: suggestionQuery,
                    variables: {
                        query: term
                    }
                })
                .then(json => {
                    let suggestions = json.data.Market.suggestion.filter(n => n)
                    dispatch(setSuggestions(suggestions))
                })
                .catch(e => console.error(e))
        } else {
            dispatch(setSuggestions([]))
        }
    }
}

export function searchItem(term, exact = false) {
    return (dispatch, getState) => {
        let region = viewSelector(getState()).get('marketRegion', 'na')
        dispatch(search(''))
        dispatch(setMarketLoading(true))

        apollo
            .query({
                query: itemQuery,
                variables: {
                    query: term,
                    region: region,
                    exact: exact
                }
            })
            .then(json => {
                dispatch(setData(json.data.Market.search))
                dispatch(setUpdate(new Date()))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setMarketLoading(false)))
    }
}

export function loadItem(item, replace = false) {
    return (dispatch, getState) => {
        let region = viewSelector(getState()).get('marketRegion', 'na')
        dispatch(search(''))

        if (!replace) dispatch(setMarketLoading(true))

        apollo
            .query({
                query: itemQuery,
                variables: {
                    region: region,
                    itemId: item
                }
            })
            .then(json => {
                dispatch(setData(json.data.Market.search))
                dispatch(setUpdate(new Date()))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setMarketLoading(false)))
    }
}

export function loadBookmarks() {
    return (dispatch, getState) => {
        let region = viewSelector(getState()).get('marketRegion', 'na')
        apollo
            .query({
                query: bookmarksQuery,
                variables: {
                    region: region
                },
                fetchPolicy: 'network-only'
            })
            .then(json => {
                let bookmarks = json.data.Market.bookmarks
                dispatch(setBookmarks(bookmarks))

                let order = bookmarks.map(bookmark => bookmark.item._id.toString())
                updateBookmarkOrder(order)
            })
            .catch(e => console.error(e))
    }
}

export function updateBookmarkOrder(order) {
    apollo
        .mutate({
            mutation: bookmarkOrderMutation,
            variables: {
                order: order
            }
        })
        .catch(e => console.error(e))
}

export function bookmark(item, add = true) {
    return dispatch => {
        let mutation = add ? createBookmarkMutation : deleteBookmarkMutation
        apollo
            .mutate({
                mutation: mutation,
                variables: {
                    itemId: item
                }
            })
            .then(() => dispatch(loadBookmarks()))
            .catch(e => console.error(e))
    }
}
