//import {createSelector} from 'reselect'
import {Map} from 'immutable'
import {createSelector} from 'reselect'

const dataSelector = state => state.getIn(['news', 'data'], Map())

export const listSelector = createSelector(dataSelector, data => data.get('list', Map()))
export const articleSelector = createSelector(dataSelector, data => data.get('article', Map()))
