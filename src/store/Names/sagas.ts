import { call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@utils/apollo'

import { loadNamesQuery } from './queries'
import actions from './actions'

// Calls
export const loadNamesCall = (locale: ReturnType<typeof actions.loadData>['payload']) => {
	return apollo.query({
		query: loadNamesQuery,
		variables: {
			locale
		}
	})
}

export function* loadNamesSaga(action: ReturnType<typeof actions.loadData>) {
	const response = yield call(loadNamesCall, action.payload)
	yield put(actions.setData(get(response, 'data.names', {})))
}
