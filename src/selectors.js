import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const generalSelector = state => state.getIn(['general'], Map())

export const currentLanguageSelector = createSelector(generalSelector, ref =>
    ref.get('language', 'en')
)
export const userSelector = createSelector(generalSelector, ref => ref.get('user', null))
export const viewSelector = createSelector(generalSelector, ref => ref.get('view', Map()))

export const loadingSelector = createSelector(generalSelector, ref => {
    let loading = false
    ref.get('loading', Map()).forEach(l => {
        loading = l || loading
    })
    return loading
})
export const loadingAppSelector = createSelector(generalSelector, ref =>
    ref.get('loadingApp', false)
)

export const supportedLanguagesSelector = createSelector(generalSelector, ref =>
    ref.get('supportedLanguages', List())
)

export const recentSearchSelector = createSelector(generalSelector, ref =>
    ref.get('recentSearch', List())
)
