import * as actionType from './actionTypes'
import {List} from 'immutable'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import {listSelector} from './selectors'

const setList = makeActionCreator(actionType.SET_NEWS_LIST, 'list')
const setArticle = makeActionCreator(actionType.SET_NEWS_ARTICLE, 'article')

export function loadNews(page = 1) {
    return dispatch => {
        dispatch(setLoading(true, 'news'))
        let url = `https://api.bnstree.com/news?page=${page}&limit=10`

        fetch(url, {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.success === 1) {
                    dispatch(setList(json.result))
                }
            })
            .then(() => dispatch(setLoading(false, 'news')))
            .catch(e => console.log(e))
    }
}

export function loadArticle(id) {
    return (dispatch, getState) => {
        let list = listSelector(getState()).get('list', List())

        let article = list.find(a => a.get('_id') === id)

        if (!article) {
            dispatch(setLoading(true, 'news'))
            fetch(`https://api.bnstree.com/news/${id}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 1) {
                        dispatch(setArticle(json.article))
                    }
                })
                .then(() => dispatch(setLoading(false, 'news')))
                .catch(e => console.log(e))
        } else {
            dispatch(setArticle(article))
        }
    }
}
