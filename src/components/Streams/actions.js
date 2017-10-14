import * as actionType from './actionTypes'

import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'
import apollo, {q} from '../../apollo'

const setList = makeActionCreator(actionType.SET_STREAM_LIST, 'list')

const streamsQuery = q`query {
	Streams {
		streams {
			_id
			viewers
            video_height
            average_fps
            stream_type
            preview {
                large
            }
            channel {
                url
                display_name
                status
            }
		}
	}
}`

export function loadStreams() {
    return dispatch => {
        dispatch(setLoading(true, 'streams'))

        apollo
            .query({
                query: streamsQuery
            })
            .then(json => {
                dispatch(setList(json.data.Streams.streams))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'streams')))
    }
}
