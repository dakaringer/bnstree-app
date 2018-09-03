import * as actionType from './actionTypes'
import {makeActionCreator} from '../shared/actionHelpers'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
export const setRegion = makeActionCreator(actionType.SET_RANK_REGION, 'region')
export const setClass = makeActionCreator(actionType.SET_RANK_CLASS, 'classCode')
export const setMode = makeActionCreator(actionType.SET_RANK_MODE, 'mode')
const loadRankingData = makeActionCreator(actionType.LOAD_RANKING_DATA, 'rankingData')

export function loadRankings(mode, region, classCode, page) {
    return (dispatch) => {
        dispatch(setRegion(region))
        dispatch(setClass(classCode))
        dispatch(setMode(mode))
        fetch('/api/character/getRankings', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({mode: mode, region: region, class: classCode, page: page})
        }).then(response => response.json()).then(json => {
            dispatch(loadRankingData(json))
        })
    }
}