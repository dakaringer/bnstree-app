import {createSelector} from 'reselect'
import {Map} from 'immutable'

const uiSelector = state => state.getIn(['character', 'ui'], Map())
export const characterSelector = state => state.getIn(['character', 'data'], Map())

export const tabSelector = createSelector(uiSelector, state => state.get('tab', 'STATS'))
