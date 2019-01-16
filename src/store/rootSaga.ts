import { all, takeLatest, call, select, put } from 'redux-saga/effects'

import { userTokenLoginSaga, loadPreferencesSaga } from './User/sagas'
import { getPreferences } from './User/selectors'
import { actions as intlActions } from './Intl'
import { actions as nameActions } from './Names'
import { actions as resourceActions } from './Resources'
import { sagaActionTypes } from './rootActionTypes'
import rootActions from './rootActions'

import userSagas from './User/sagas'
import intlSagas, { loadLocaleSaga } from './Intl/sagas'
import { loadResourceSaga } from './Resources/sagas'
import { loadNamesSaga } from './Names/sagas'
import characterSagas from './Character/sagas'
import skillSagas from './Skills/sagas'
import skillSagasLegacy from './SkillsLegacy/sagas'
import itemSagas from './Items/sagas'

function* initializeAppSaga() {
	yield call(userTokenLoginSaga)
	yield call(loadPreferencesSaga)
	const userPreferences = yield select(getPreferences)
	yield call(loadLocaleSaga, { payload: userPreferences.locale } as ReturnType<typeof intlActions.loadLocale>)
	yield call(loadNamesSaga, { payload: userPreferences.locale } as ReturnType<typeof nameActions.loadData>)
	yield call(loadResourceSaga, { payload: userPreferences.locale } as ReturnType<typeof resourceActions.loadData>)
	yield put(rootActions.setLoading(false))
}

export default function*() {
	yield takeLatest(sagaActionTypes.INIT, initializeAppSaga)
	yield all([userSagas(), intlSagas(), characterSagas(), skillSagas(), skillSagasLegacy(), itemSagas()])
}
