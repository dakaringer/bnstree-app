import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import {articleSelector} from './selectors'

import {message} from 'antd'

const setStatus = makeActionCreator(actionType.SET_EDITOR_STATUS, 'context', 'value')
export const setScrollPosition = makeActionCreator(actionType.SET_EDITOR_SCROLL_POSITION, 'value')

const setArticle = makeActionCreator(actionType.SET_EDITOR_ARTICLE, 'article')
const editArticle = makeActionCreator(actionType.UPDATE_EDITOR_ARTICLE, 'context', 'value')

const articleQuery = q`query ($id: ID!) {
    Articles {
        article(id: $id) {
            _id
            title
            datePosted
            content
            thumb
            published
        }
    }
}`

const saveArticleMutation = q`mutation (
    $_id: ID, 
    $title: String!,
    $content: String,
    $thumb: String,
    $published: Boolean!
) {
    Articles {
        saveArticle(
            _id: $_id,
            title: $title,
            content: $content,
            thumb: $thumb,
            published: $published
        )
    }
}`

const deleteArticleMutation = q`mutation ($_id: ID!) {
    Articles {
        deleteArticle(_id: $_id)
    }
}`

export function loadArticle(id) {
    return (dispatch, getState) => {
        dispatch(setArticle({}))

        dispatch(setLoading(true, 'editor'))
        if (id) {
            apollo
                .query({
                    query: articleQuery,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'network-only'
                })
                .then(json => {
                    dispatch(setArticle(json.data.Articles.article))
                })
                .catch(e => console.error(e))
                .then(() => dispatch(setLoading(false, 'editor')))
        }
    }
}

export function updateArticle(context, value) {
    return dispatch => {
        dispatch(editArticle(context, value))
        dispatch(setStatus('saving', null))
    }
}

export function saveArticle(history) {
    return (dispatch, getState) => {
        dispatch(setStatus('saving', true))
        dispatch(setStatus('error', false))

        let article = articleSelector(getState())
        let savingArticle = {
            _id: article.get('_id', null),
            title: article.get('title', ''),
            content: article.get('content', ''),
            thumb: article.get('thumb', ''),
            published: article.get('published', false)
        }

        apollo
            .mutate({
                mutation: saveArticleMutation,
                variables: savingArticle
            })
            .then(json => {
                let id = json.data.Articles.saveArticle
                dispatch(updateArticle('_id', id))
                history.replace(`/editor/${id}`)
            })
            .catch(e => {
                dispatch(setStatus('error', true))
                console.error(e)
            })
            .then(() => {
                dispatch(setStatus('saving', false))
            })
    }
}

export function deleteArticle(history) {
    return (dispatch, getState) => {
        let article = articleSelector(getState())

        apollo
            .mutate({
                mutation: deleteArticleMutation,
                variables: {_id: article.get('_id')}
            })
            .then(json => {
                dispatch(updateArticle('_id', null))
                history.replace('/editor')
                message.success('Deleted')
            })
            .catch(e => {
                dispatch(setStatus('error', true))
                console.error(e)
            })
    }
}
