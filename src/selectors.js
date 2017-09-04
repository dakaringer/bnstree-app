import {createSelector} from 'reselect'
import {Map} from 'immutable'

const generalSelector = state => state.getIn(['general'], Map())

export const currentLanguageSelector = createSelector(generalSelector, ref =>
    ref.get('language', 'en')
)
export const userSelector = createSelector(generalSelector, ref => ref.get('user', null))
export const loadingSelector = createSelector(generalSelector, ref => {
    let loading = false
    ref.get('loading', Map()).forEach(l => (loading = l || loading))
    return loading
})
export const initializedSelector = createSelector(generalSelector, ref =>
    ref.get('initialized', true)
)
