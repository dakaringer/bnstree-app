import {Map} from 'immutable'
import {createSelector} from 'reselect'

const editorSelector = state => state.getIn(['news', 'editor'], Map())
const dataSelector = state => state.getIn(['news', 'data'], Map())

export const listSelector = createSelector(dataSelector, data => data.get('list', Map()))
export const articleSelector = createSelector(dataSelector, data => data.get('article', Map()))

export const editorArticleSelector = createSelector(editorSelector, data =>
    data.get('article', Map())
)
export const editorSavedSelector = createSelector(editorSelector, data => data.get('saved', false))
