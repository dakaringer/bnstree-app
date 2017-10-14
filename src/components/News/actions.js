import * as actionType from './actionTypes'
import {List} from 'immutable'
import apollo, {q} from '../../apollo'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import {listSelector, editorArticleSelector} from './selectors'

import {message} from 'antd'

const setList = makeActionCreator(actionType.SET_NEWS_LIST, 'list')
const setArticle = makeActionCreator(actionType.SET_NEWS_ARTICLE, 'article')

const setEditorArticle = makeActionCreator(actionType.SET_EDITOR_ARTICLE, 'article')
export const updateEditorArticle = makeActionCreator(
    actionType.UPDATE_EDITOR_ARTICLE,
    'context',
    'value'
)
const setEditorSaved = makeActionCreator(actionType.SET_EDITOR_SAVED, 'saved')

const articleListQuery = q`query ($page: Int, $limit: Int) {
    Articles {
        list(page: $page, limit: $limit) {
            _id
            title
            datePosted
            content
            thumb
        }
        count(page: $page, limit: $limit)
    }
}`

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

export function loadNews(page = 1) {
    return dispatch => {
        dispatch(setLoading(true, 'news'))

        apollo
            .query({
                query: articleListQuery,
                variables: {
                    page: page,
                    limit: 10
                }
            })
            .then(json => {
                dispatch(setList(json.data.Articles))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'news')))
    }
}

export function loadArticle(id, editor = false) {
    return (dispatch, getState) => {
        let list = listSelector(getState()).get('list', List())

        let article = list.find(a => a.get('_id') === id)

        if (!article) {
            dispatch(setLoading(true, 'news'))

            apollo
                .query({
                    query: articleQuery,
                    variables: {
                        id: id
                    }
                })
                .then(json => {
                    if (editor) {
                        dispatch(setEditorArticle(json.data.Articles.article))
                    } else {
                        dispatch(setArticle(json.data.Articles.article))
                    }
                })
                .catch(e => console.error(e))
                .then(() => dispatch(setLoading(false, 'news')))
        } else {
            if (editor) {
                dispatch(setEditorArticle(article))
            } else {
                dispatch(setArticle(article))
            }
        }
    }
}

export function saveArticle() {
    return (dispatch, getState) => {
        dispatch(setEditorSaved(false))

        let article = editorArticleSelector(getState())
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
                dispatch(setEditorSaved(false))
                dispatch(updateEditorArticle('_id', json.data.Articles.updateArticle))
                message.success('Success')
            })
            .catch(e => {
                message.error('Failed')
                console.error(e)
            })
    }
}

export function deleteArticle() {
    return (dispatch, getState) => {
        dispatch(setEditorSaved(false))

        let article = editorArticleSelector(getState())

        apollo
            .mutate({
                mutation: deleteArticleMutation,
                variables: {_id: article.get('_id')}
            })
            .then(json => {
                dispatch(setEditorSaved(false))
                dispatch(updateEditorArticle('_id', null))
                message.success('Success')
            })
            .catch(e => {
                message.error('Failed')
                console.error(e)
            })
    }
}
