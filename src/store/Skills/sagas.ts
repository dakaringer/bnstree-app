import { takeLatest, call, put, select } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@utils/apollo'

import { sagaActionTypes } from './actionTypes'
import { loadDataQuery } from './queries'
import actions from './actions'
import { getData, getCurrentClass } from './selectors'

// Calls
const loadDataCall = (classCode: ReturnType<typeof actions.loadData>['payload'], force?: boolean) => {
	return apollo.query({
		query: loadDataQuery,
		variables: {
			classCode
		},
		fetchPolicy: force ? 'no-cache' : 'cache-first'
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

function* reloadSkillDataSaga() {
	const classCode = yield select(getCurrentClass)

	const response = yield call(loadDataCall, classCode, true)
	yield put(
		actions.setData({
			classCode,
			data: get(response, 'data.skills.data', null),
			traits: get(response, 'data.skills.traits', null)
		})
	)
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.LOAD_DATA, loadSkillDataSaga)
	yield takeLatest(sagaActionTypes.RELOAD_DATA, reloadSkillDataSaga)
}
