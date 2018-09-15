import { takeLatest, call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@src/apollo'

import { sagaActionTypes } from './actionTypes'
import { searchCharacterQuery } from './queries'
import Actions from './actions'

// Calls
const searchCharacterCall = (payload: ReturnType<typeof Actions.search>['payload']) => {
	return apollo.query({
		query: searchCharacterQuery,
		variables: payload,
		fetchPolicy: 'network-only'
	})
}

// Sagas
function* searchCharacterSaga(action: ReturnType<typeof Actions.search>) {
	if (!action.payload) {
		return yield put(Actions.setData(null))
	}

	yield put(Actions.setLoading(true))
	const response = yield call(searchCharacterCall, action.payload)
	yield put(Actions.setData(get(response, 'data.character.data', null)))
	yield put(Actions.setLoading(false))
}

// Watcher
export default function* watchCharacter() {
	yield takeLatest(sagaActionTypes.SEARCH, searchCharacterSaga)
}
