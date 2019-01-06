import { takeLatest, call, put, select } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@src/apollo'

import { sagaActionTypes } from './actionTypes'
import { loadDataQuery } from './queries'
import Actions from './actions'
import { getData } from './selectors'

// Calls
const loadDataCall = (classCode: ReturnType<typeof Actions.loadData>['payload']) => {
	return apollo.query({
		query: loadDataQuery,
		variables: {
			classCode
		}
	})
}

// Sagas
function* loadSkillDataSaga(action: ReturnType<typeof Actions.loadData>) {
	const data = yield select(getData)
	if (data[action.payload]) return
	yield put(Actions.setLoading(true))
	const response = yield call(loadDataCall, action.payload)
	yield put(
		Actions.setData({
			classCode: action.payload,
			data: get(response, 'data.skills.dataLegacy', null)
		})
	)
	yield put(Actions.setLoading(false))
}

// Watcher
export default function* watchCharacter() {
	yield takeLatest(sagaActionTypes.LOAD_DATA, loadSkillDataSaga)
}
