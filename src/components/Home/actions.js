import * as actionType from './actionTypes'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import apollo, {q} from '../../apollo'

const setList = makeActionCreator(actionType.SET_TWITTER_LIST, 'list')

const twitterQuery = q`query {
	Twitter {
		tweets
	}
}`

export function loadTwitter() {
    return dispatch => {
        dispatch(setLoading(true, 'twitter'))

        apollo
            .query({
                query: twitterQuery
            })
            .then(json => {
                dispatch(setList(json.data.Twitter.tweets))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'twitter')))
    }
}
