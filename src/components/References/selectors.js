import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {currentLanguageSelector} from '../../selectors'

const dataSelector = state => state.getIn(['references', 'data'], Map())

export const skillNamesSelector = createSelector(
    dataSelector,
    currentLanguageSelector,
    (state, language) =>
        state.getIn(['skillNames', language], state.getIn(['skillNames', 'en'], Map()))
)
export const skillNamesSelectorEN = createSelector(dataSelector, state =>
    state.getIn(['skillNames', 'en'], Map())
)

export const itemNamesSelector = createSelector(
    dataSelector,
    currentLanguageSelector,
    (state, language) => state.getIn(['itemNames', language], Map())
)

export const itemNamesSelectorEN = createSelector(dataSelector, state =>
    state.getIn(['itemNames', 'en'], Map())
)

export const patchListSelector = createSelector(dataSelector, state =>
    state.get('patchList', List())
)
