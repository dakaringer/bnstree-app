import { mergeWith } from 'lodash-es'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { Names } from './types'
import Actions from './actions'

export type State = DeepReadonly<Names>

const initialState = {
	data: {}
}

export default (state: State = initialState, action: Actions) => {
	switch (action.type) {
		case reduxActionTypes.PATCH_DATA: {
			return {
				data: mergeWith({}, state.data, action.payload, (a, b) => (b === null ? a : undefined))
			}
		}
		default:
			return state
	}
}
