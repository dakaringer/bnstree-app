import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import {articleSelector} from './selectors'

import {message} from 'antd'

const setStatus = makeActionCreator(actionType.SET_EDITOR_STATUS, 'type', 'value')
export const setScrollPosition = makeActionCreator(actionType.SET_EDITOR_SCROLL_POSITION, 'value')

const setArticle = makeActionCreator(actionType.SET_EDITOR_ARTICLE, 'article')
export const updateArticle = makeActionCreator(actionType.UPDATE_EDITOR_ARTICLE, 'context', 'value')

const articleQuery = q`query ($id: ID!) {
    Articles {
        article(id: $id) {
            _id
            title
            datePosted
            content
            thumb
        }
    }
}`

const saveArticleMutation = q`mutation (
    $_id: ID, 
    $title: String!,
    $content: String,
    $thumb: String
) {
    Articles {
        updateArticle(
            _id: $_id,
            title: $title,
            content: $content,
            thumb: $thumb
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
                    }
                })
                .then(json => {
                    dispatch(setArticle(json.data.Articles.article))
                })
                .catch(e => console.error(e))
                .then(() => dispatch(setLoading(false, 'editor')))
        }
    }
}

export function saveArticle() {
    return (dispatch, getState) => {
        dispatch(setStatus('saving', true))
        dispatch(setStatus('error', false))

        let article = articleSelector(getState())
        let savingArticle = {
            _id: article.get('_id', null),
            title: article.get('title', ''),
            content: article.get('content', ''),
            thumb: article.get('thumb', '')
        }

        apollo
            .mutate({
                mutation: saveArticleMutation,
                variables: savingArticle
            })
            .then(json => {
                dispatch(updateArticle('_id', json.data.Articles.updateArticle))
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

export function deleteArticle() {
    return (dispatch, getState) => {
        let article = articleSelector(getState())

        apollo
            .mutate({
                mutation: deleteArticleMutation,
                variables: {_id: article.get('_id')}
            })
            .then(json => {
                dispatch(updateArticle('_id', null))
                message.success('Deleted')
            })
            .catch(e => {
                dispatch(setStatus('error', true))
                console.error(e)
            })
    }
}
