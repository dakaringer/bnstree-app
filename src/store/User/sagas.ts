import { takeLatest, call, put, select, delay } from 'redux-saga/effects'
import { get, mergeWith } from 'lodash-es'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import apollo from '@utils/apollo'

import { sagaActionTypes } from './actionTypes'
import {
	loadPreferencesQuery,
	idTokenLoginMutation,
	userTokenLoginMutation,
	logoutMutation,
	updatePreferencesMutation
} from './queries'
import actions from './actions'
import { getData } from './selectors'

// Calls
const loadPreferencesCall = () => {
	return apollo.query({
		query: loadPreferencesQuery,
		fetchPolicy: 'network-only'
	})
}

const loadPreferencesLocalCall = () => {
	return idbGet('userPreferences')
}

const idTokenLoginCall = (idToken: string) => {
	console.info(idToken)
	return apollo.mutate({
		mutation: idTokenLoginMutation,
		variables: { idToken },
		errorPolicy: 'ignore'
	})
}

const userTokenLoginCall = () => {
	return apollo.mutate({
		mutation: userTokenLoginMutation,
		errorPolicy: 'ignore'
	})
}

const logoutCall = () => {
	return apollo.mutate({
		mutation: logoutMutation
	})
}

const updatePreferencesCall = (payload: ReturnType<typeof actions.updatePreferences>['payload']) => {
	return apollo.mutate({
		mutation: updatePreferencesMutation,
		variables: {
			preferences: payload
		}
	})
}

const updatePreferencesLocalCall = async (payload: ReturnType<typeof actions.updatePreferences>['payload']) => {
	const preferences = await idbGet('userPreferences')
	idbSet('userPreferences', mergeWith(preferences || {}, payload, (a, b) => (b === null ? a : undefined)))
}

// Sagas
export function* loadPreferencesSaga() {
	const user = yield select(getData)
	let preferences
	if (user) {
		const response = yield call(loadPreferencesCall)
		preferences = get(response, 'data.user.preferences', null)
	} else {
		preferences = yield call(loadPreferencesLocalCall)
	}

	yield put(actions.setPreferences(preferences))
}

function* idTokenLoginSaga(action: ReturnType<typeof actions.idTokenLogin>) {
	const response = yield call(idTokenLoginCall, action.payload)
	yield put(actions.setData(get(response, 'data.user.login.withIdToken', null)))
}

export function* userTokenLoginSaga() {
	const response = yield call(userTokenLoginCall)
	yield put(actions.setData(get(response, 'data.user.login.withUserToken', null)))
}

function* logoutSaga() {
	yield put(actions.setShowLogoutMessage(true))
	yield put(actions.clearData())
	yield call(logoutCall)
	yield delay(2000)
	yield put(actions.setShowLogoutMessage(false))
}

function* updatePreferencesSaga(action: ReturnType<typeof actions.updatePreferences>) {
	const user = yield select(getData)
	yield put(actions.setPreferences(action.payload))

	if (user) {
		yield call(updatePreferencesCall, action.payload)
	} else {
		yield call(updatePreferencesLocalCall, action.payload)
	}
}

// Watcher
export default function*() {
	yield takeLatest(sagaActionTypes.ID_TOKEN_LOGIN, idTokenLoginSaga)
	yield takeLatest(sagaActionTypes.LOGOUT, logoutSaga)
	yield takeLatest(sagaActionTypes.UPDATE_PREFERENCES, updatePreferencesSaga)
}
