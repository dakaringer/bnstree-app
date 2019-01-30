import { call, put } from 'redux-saga/effects'
import { get } from 'lodash-es'
import apollo from '@utils/apollo'

import { loadResourceQuery } from './queries'
import actions from './actions'

// Calls
export const loadResourceCall = (locale: ReturnType<typeof actions.loadData>['payload']) => {
	return apollo.query({
		query: loadResourceQuery,
		variables: {
			locale
		}
	})
}

export function* loadResourceSaga(action: ReturnType<typeof actions.loadData>) {
	const response = yield call(loadResourceCall, action.payload)
	yield put(actions.setData(get(response, 'data.resources', {})))
}
