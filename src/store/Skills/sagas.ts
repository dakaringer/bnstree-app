import { takeLatest, call, put, select } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@src/utils/apollo'

import { sagaActionTypes } from './actionTypes'
import { loadDataQuery } from './queries'
import actions from './actions'
import { getData } from './selectors'

// Calls
const loadDataCall = (classCode: ReturnType<typeof actions.loadData>['payload']) => {
	return apollo.query({
		query: loadDataQuery,
		variables: {
			classCode
		}
	})
}

// Sagas
function* loadSkillDataSaga(action: ReturnType<typeof actions.loadData>) {
	yield put(actions.setClass(action.payload))
	const data = yield select(getData)

	if (data[action.payload]) {
		return
	}

	yield put(actions.setLoading(true))
	const response = yield call(loadDataCall, action.payload)
	yield put(
		actions.setData({
			classCode: action.payload,
			data: get(response, 'data.skills.data', null),
			traits: get(response, 'data.skills.traits', null)
		})
	)
	yield put(actions.setLoading(false))
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.LOAD_DATA, loadSkillDataSaga)
}
