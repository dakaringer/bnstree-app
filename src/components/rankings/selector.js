import {createSelector} from 'reselect'
import {Map} from 'immutable'

const uiSelector = state => state.getIn([
    'rankings', 'ui'
], Map())

export const rankingDataSelector = state => state.getIn([
    'rankings', 'data'
], Map())

const generalSelector = state => state.get('general', Map())

export const uiTextSelector = createSelector(generalSelector, ref => ref.get('uiText', Map()))

export const regionSelector = createSelector(uiSelector, state => state.get('region', 'na'))
export const classSelector = createSelector(uiSelector, state => state.get('class', 'all'))
export const modeSelector = createSelector(uiSelector, state => state.get('mode', 'solo'))

