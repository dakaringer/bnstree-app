import { takeLatest, call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@utils/apollo'

import { sagaActionTypes } from './actionTypes'
import { searchCharacterQuery } from './queries'
import actions from './actions'

// Calls
const searchCharacterCall = (payload: ReturnType<typeof actions.search>['payload']) => {
	return apollo.query({
		query: searchCharacterQuery,
		variables: payload,
		fetchPolicy: 'network-only'
	})
}

// Sagas
function* searchCharacterSaga(action: ReturnType<typeof actions.search>) {
	if (!action.payload) {
		return yield put(actions.setData(null))
	}

	yield put(actions.setLoading(true))
	const response = yield call(searchCharacterCall, action.payload)
	yield put(actions.setData(get(response, 'data.character.data', null)))
	yield put(actions.setLoading(false))
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.SEARCH, searchCharacterSaga)
}
