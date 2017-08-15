import * as actionType from './actionTypes'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'

const setList = makeActionCreator(actionType.SET_STREAM_LIST, 'list')

export function loadStreams() {
    return dispatch => {
        dispatch(setLoading(true))
        fetch('https://api.bnstree.com/streams', {
            method: 'get',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                dispatch(setList(json.streams))
            })
            .then(() => dispatch(setLoading(false)))
            .catch(e => console.log(e))
    }
}
