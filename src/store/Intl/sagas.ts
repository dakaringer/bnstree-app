import { takeLatest, call, put } from 'redux-saga/effects'

import apollo from '@src/utils/apollo'
import { get } from 'lodash-es'

import { sagaActionTypes } from './actionTypes'
import { loadLocaleQuery } from './queries'
import actions from './actions'

// Calls
const loadLocaleCall = (locale: ReturnType<typeof actions.loadLocale>['payload']) => {
	return apollo.query({
		query: loadLocaleQuery,
		variables: {
			locale
		}
	})
}

// Sagas
export function* loadLocaleSaga(action: ReturnType<typeof actions.loadLocale>) {
	yield put(actions.setLoading(true))
	const response = yield call(loadLocaleCall, action.payload)
	yield put(
		actions.setMessages({
			messages: get(response, 'data.intl.messages', null),
			locale: action.payload
		})
	)
	yield put(actions.setLoading(false))
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.LOAD_LOCALE, loadLocaleSaga)
}
