import * as actionType from './actionTypes'
import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'

import {regionSelector, dataSelector} from './selectors'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
const setRegion = makeActionCreator(actionType.SET_MARKET_REGION, 'region')
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

export function getRegion() {
    return dispatch => {
        dispatch(setLoading(true, 'market'))
        fetch('https://api.bnstree.com/market/region', {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 0) return dispatch(setRegion('na'))
                dispatch(setRegion(json.region))
            })
            .then(() => dispatch(setLoading(false, 'market')))
            .catch(e => console.error(e))
    }
}

export function loadPopularItems() {
    return (dispatch, getState) => {
        let region = regionSelector(getState())
        fetch(`https://api.bnstree.com/market/${region}/popular?fast=true`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 0) return

                dispatch(setPopularItems(json.list))
                fetch(`https://api.bnstree.com/market/${region}/popular`, {
                    method: 'get',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.success === 0) return

                        dispatch(setPopularItems(json.list))
                    })
                    .catch(e => console.error(e))
            })
            .catch(e => console.error(e))
    }
}

export function updateRegion(region) {
    return (dispatch, getState) => {
        dispatch(setRegion(region))
        dispatch(loadPopularItems())
        dispatch(loadBookmarks())
        fetch('https://api.bnstree.com/user/view', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({marketRegion: region})
        }).catch(e => console.error(e))

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
            fetch(`https://api.bnstree.com/market/suggest?q=${term}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 0) return

                    dispatch(setSuggestions(json.data))
                })
                .catch(e => console.error(e))
        } else {
            dispatch(setSuggestions([]))
        }
    }
}

export function searchItem(term, exact = false) {
    return (dispatch, getState) => {
        let region = regionSelector(getState())
        dispatch(search(''))
        dispatch(setMarketLoading(true))
        fetch(`https://api.bnstree.com/market/${region}/search?q=${term}&exact=${exact ? 1 : 0}`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 0) return

                dispatch(setData(json))
                dispatch(setUpdate(new Date()))
            })
            .then(() => dispatch(setMarketLoading(false)))
            .catch(e => console.error(e))
    }
}

export function loadItem(item, replace = false) {
    return (dispatch, getState) => {
        let region = regionSelector(getState())
        dispatch(search(''))
        if (!replace) dispatch(setMarketLoading(true))
        fetch(`https://api.bnstree.com/market/${region}/data/${item}`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 0) return

                dispatch(setData(json))
                dispatch(setUpdate(new Date()))
            })
            .then(() => dispatch(setMarketLoading(false)))
            .catch(e => console.error(e))
    }
}

export function loadBookmarks() {
    return (dispatch, getState) => {
        let region = regionSelector(getState())
        fetch(`https://api.bnstree.com/market/${region}/bookmarks?fast=true`, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 0) return

                dispatch(setBookmarks(json.list))
                fetch(`https://api.bnstree.com/market/${region}/bookmarks`, {
                    method: 'get',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.success === 0) return

                        dispatch(setBookmarks(json.list))
                    })
                    .catch(e => console.error(e))
            })
            .catch(e => console.error(e))
    }
}
