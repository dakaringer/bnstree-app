import { call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@src/utils/apollo'

import { loadResourceQuery } from './queries'
import Actions from './actions'

// Calls
export const loadResourceCall = (locale: ReturnType<typeof Actions.loadData>['payload']) => {
	return apollo.query({
		query: loadResourceQuery,
		variables: {
			locale
		}
	})
}

export function* loadResourceSaga(action: ReturnType<typeof Actions.loadData>) {
	const response = yield call(loadResourceCall, action.payload)
	yield put(Actions.setData(get(response, 'data.resources', {})))
}
