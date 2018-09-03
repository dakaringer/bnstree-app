import * as actionType from './actionTypes'
import {makeActionCreator} from '../shared/actionHelpers'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

import {setNews} from '../../actions'

const setBuilds = makeActionCreator(actionType.SET_LATEST_BUILDS, 'builds')

export function loadLatestNews() {
    return (dispatch) => {
        fetch('/api/general/loadNewsList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({page: 1})
        }).then(response => response.json()).then(json => {
            dispatch(setNews(json))
        })
    }
}

export function loadLatestBuilds() {
    return (dispatch) => {
        fetch('/api/trainer2/loadBuildList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify()
        }).then(response => response.json()).then(json => {
            dispatch(setBuilds(json))
        })
    }
}
