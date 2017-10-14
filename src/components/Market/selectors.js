import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const uiSelector = state => state.getIn(['market', 'ui'], Map())
export const dataSelector = state => state.getIn(['market', 'data'], Map())

export const searchSelector = createSelector(uiSelector, state => state.get('search', ''))
export const suggestionsSelector = createSelector(uiSelector, state =>
    state.get('suggestions', List())
)
export const bookmarksSelector = createSelector(uiSelector, state => {
    let offset = 0
    return state.get('bookmarks', List()).map(bookmark => {
        if (!bookmark.hasIn(['item', 'index'])) {
            bookmark = bookmark.setIn(['item', 'index'], -1 - offset)
            offset += 1
        }
        return bookmark
    })
})
export const popularItemsSelector = createSelector(uiSelector, state =>
    state.get('popularItems', List())
)
export const graphSelector = createSelector(uiSelector, state => state.get('graph', 'candlestick'))
export const termSelector = createSelector(uiSelector, state => state.get('term', 0))
export const indicatorSelector = createSelector(uiSelector, state => state.get('indicators', Map()))
export const updateSelector = createSelector(uiSelector, state => state.get('lastUpdate', null))
export const loadingSelector = createSelector(uiSelector, state => state.get('loading', false))
