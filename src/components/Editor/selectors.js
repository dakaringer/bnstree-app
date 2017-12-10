import {Map} from 'immutable'
import {createSelector} from 'reselect'

const uiSelector = state => state.getIn(['editor', 'ui'], Map())
const dataSelector = state => state.getIn(['editor', 'data'], Map())

export const statusSelector = createSelector(uiSelector, ui => ui.get('status', Map()))
export const scrollPositionSelector = createSelector(uiSelector, ui => ui.get('scrollPosition', 0))

export const articleSelector = createSelector(dataSelector, data => data.get('article', Map()))
