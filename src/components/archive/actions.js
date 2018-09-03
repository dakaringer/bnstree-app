const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

import {setNews} from '../../actions'

export function loadNews(page) {
    return (dispatch) => {
        fetch('/api/general/loadNewsList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({page: page, limit: 15})
        }).then(response => response.json()).then(json => {
            dispatch(setNews(json))
        })
    }
}
