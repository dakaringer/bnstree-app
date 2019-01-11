import { call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@src/utils/apollo'

import { loadNamesQuery } from './queries'
import Actions from './actions'

// Calls
export const loadNamesCall = (locale: ReturnType<typeof Actions.loadData>['payload']) => {
	return apollo.query({
		query: loadNamesQuery,
		variables: {
			locale
		}
	})
}

export function* loadNamesSaga(action: ReturnType<typeof Actions.loadData>) {
	const response = yield call(loadNamesCall, action.payload)
	yield put(Actions.setData(get(response, 'data.names', {})))
}
