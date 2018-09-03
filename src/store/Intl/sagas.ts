import { takeLatest, call, put } from 'redux-saga/effects'

import apollo from '@src/apollo'
import { get } from 'lodash-es'

import { sagaActionTypes } from './actionTypes'
import { loadLocaleQuery } from './queries'
import Actions from './actions'

// Calls
const loadLocaleCall = (locale: ReturnType<typeof Actions.loadLocale>['payload']) => {
	return apollo.query({
		query: loadLocaleQuery,
		variables: {
			locale
		}
	})
}

// Sagas
export function* loadLocaleSaga(action: ReturnType<typeof Actions.loadLocale>) {
	yield put(Actions.setLoading(true))
	const response = yield call(loadLocaleCall, action.payload)
	yield put(
		Actions.setMessages({
			messages: get(response, 'data.intl.messages', null),
			locale: action.payload
		})
	)
	yield put(Actions.setLoading(false))
}

// Watcher
export default function* watchCharacter() {
	yield takeLatest(sagaActionTypes.LOAD_LOCALE, loadLocaleSaga)
}
