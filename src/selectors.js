import {createSelector} from 'reselect'
import {Map, List} from 'immutable'

const generalSelector = state => state.getIn(['general'], Map())

export const currentLanguageSelector = createSelector(generalSelector, ref =>
    ref.get('language', 'en')
)
export const userSelector = createSelector(generalSelector, ref => ref.get('user', null))
export const loadingSelector = createSelector(generalSelector, ref => {
    let loading = false
    ref.get('loading', Map()).forEach(l => {
        loading = l || loading
    })
    return loading
})
export const loadingAppSelector = createSelector(generalSelector, ref => {
    let loading = false
    ref.get('loadingApp', Map()).forEach(l => {
        loading = l || loading
    })
    return loading
})
export const supportedLanguagesSelector = createSelector(generalSelector, ref =>
    ref.get('supportedLanguages', List())
)
