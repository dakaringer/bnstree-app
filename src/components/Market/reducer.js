import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function ui(
    state = fromJS({
        search: '',
        suggestions: [],
        bookmarks: [],
        popularItems: [],
        graph: 'candlestick',
        term: 0,
        indicators: {
            sma: false,
            bb: false,
            sto: false
        },
        lastUpdate: null,
        loading: false
    }),
    action
) {
    switch (action.type) {
        case actionType.SET_MARKET_SEARCH:
            return state.set('search', action.search)
        case actionType.SET_MARKET_SUGGESTIONS:
            return state.merge({suggestions: action.list})
        case actionType.SET_MARKET_BOOKMARKS:
            return state.merge({bookmarks: action.list})
        case actionType.SET_MARKET_POPULAR_ITEMS:
            return state.merge({popularItems: action.list})
        case actionType.SET_MARKET_GRAPH:
            return state.set('graph', action.graph)
        case actionType.SET_MARKET_TERM:
            return state.set('term', action.term)
        case actionType.SET_MARKET_GRAPH_INDICATOR:
            return state.setIn(['indicators', action.indicator], action.value)
        case actionType.SET_MARKET_LAST_UPDATE:
            return state.set('lastUpdate', action.value)
        case actionType.SET_MARKET_LOADING:
            return state.set('loading', action.loading)
        default:
            return state
    }
}

function data(state = Map(), action) {
    switch (action.type) {
        case actionType.SET_MARKET_DATA:
            if (action.itemData) {
                return fromJS(action.itemData)
            } else {
                return Map()
            }
        default:
            return state
    }
}

export default combineReducers({ui, data})
