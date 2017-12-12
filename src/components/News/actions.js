import * as actionType from './actionTypes'
import {List} from 'immutable'
import apollo, {q} from '../../apollo'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import {listSelector} from './selectors'

const setList = makeActionCreator(actionType.SET_NEWS_LIST, 'list')
const setArticle = makeActionCreator(actionType.SET_NEWS_ARTICLE, 'article')

const articleListQuery = q`query ($page: Int, $limit: Int) {
    Articles {
        list(page: $page, limit: $limit) {
            _id
            title
            datePosted
            content
            thumb
            published
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
                let result = Object.assign({}, json.data.Articles)
                result.page = page
                result.limit = 10
                dispatch(setList(result))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'news')))
    }
}

export function loadArticle(id) {
    return (dispatch, getState) => {
        let list = listSelector(getState()).get('list', List())
        let article = list.find(a => a.get('_id') === id)

        if (!article) {
            dispatch(setLoading(true, 'news'))
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
                    .then(() => dispatch(setLoading(false, 'news')))
            }
        } else {
            dispatch(setArticle(article))
        }
    }
}
