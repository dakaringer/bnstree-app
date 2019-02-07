import { takeLatest, call, put, select } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@utils/apollo'

import { sagaActionTypes } from './actionTypes'
import { loadDataQuery } from './queries'
import actions from './actions'
import { getData } from './selectors'

// Calls
const loadDataCall = (type: ReturnType<typeof actions.loadData>['payload']) => {
	return apollo.query({
		query: loadDataQuery,
		variables: {
			type
		}
	})
}

// Sagas
function* loadItemDataSaga(action: ReturnType<typeof actions.loadData>) {
	yield put(actions.setType(action.payload))
	const data = yield select(getData)

	if (data[action.payload]) {
		return
	}

	yield put(actions.setLoading(true))
	const response = yield call(loadDataCall, action.payload)
	yield put(
		actions.setData({
			itemType: action.payload,
			data: get(response, 'data.items.data', null)
		})
	)
	yield put(actions.setLoading(false))
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.LOAD_DATA, loadItemDataSaga)
}
