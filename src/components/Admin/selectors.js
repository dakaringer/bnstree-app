import {Map} from 'immutable'
import {createSelector} from 'reselect'

const uiSelector = state => state.getIn(['admin', 'ui'], Map())

export const viewSelector = createSelector(uiSelector, ui => ui.get('view', 'news'))
