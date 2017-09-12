import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const uiSelector = state => state.getIn(['market', 'ui'], Map())
export const dataSelector = state => state.getIn(['market', 'data'], Map())

export const regionSelector = createSelector(uiSelector, state => state.get('region', 'na'))
export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const suggestionsSelector = createSelector(uiSelector, state =>
    state.get('suggestions', List())
)
export const bookmarksSelector = createSelector(uiSelector, state => state.get('bookmarks', List()))
export const popularItemsSelector = createSelector(uiSelector, state =>
    state.get('popularItems', List())
)
export const graphSelector = createSelector(uiSelector, state => state.get('graph', 'candlestick'))
export const termSelector = createSelector(uiSelector, state => state.get('term', 0))
export const indicatorSelector = createSelector(uiSelector, state => state.get('indicators', Map()))
export const updateSelector = createSelector(uiSelector, state => state.get('lastUpdate', null))
