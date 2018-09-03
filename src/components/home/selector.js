import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const homeSelector = state => state.getIn([
    'home'
], Map())

export const latestBuildsSelector = createSelector(homeSelector, ref => ref.get('latestBuilds', List()))
