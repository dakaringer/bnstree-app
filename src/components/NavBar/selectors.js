import {Map} from 'immutable'
import {createSelector} from 'reselect'

const uiSelector = state => state.getIn(['navbar', 'ui'], Map())

export const menuStatusSelector = createSelector(uiSelector, data => data.get('menuStatus', false))
export const dropdownStatusSelector = createSelector(uiSelector, data =>
    data.get('dropdownStatus', null)
)
export const dropdownPositionSelector = createSelector(uiSelector, data =>
    data.get('dropdownPosition', Map())
)
