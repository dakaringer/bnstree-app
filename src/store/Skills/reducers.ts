import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { Skills } from './types'
import Actions from './actions'

export type State = DeepReadonly<Skills>

const initialState = {
	data: {
		BM: null,
		KF: null,
		DE: null,
		FM: null,
		AS: null,
		SU: null,
		BD: null,
		WL: null,
		SF: null,
		GS: null,
		WA: null
	},
	isLoading: false
}

export default (state: State = initialState, action: Actions) => {
	switch (action.type) {
		case reduxActionTypes.SET_DATA: {
			return {
				...state,
				data: {
					...state.data,
					[action.payload.classCode]: action.payload.data
				}
			}
		}
		case reduxActionTypes.SET_LOADING: {
			return {
				...state,
				isLoading: action.payload
			}
		}
		default:
			return state
	}
}
