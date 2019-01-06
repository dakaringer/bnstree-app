import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { Skills } from './types'
import Actions from './actions'

import { ClassCode } from '@src/store/constants'

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
		WR: null
	},
	traits: {
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
		WR: null
	},
	currentClass: 'BM' as ClassCode,
	isLoading: false
}

export default (state: State = initialState, action: Actions) => {
	switch (action.type) {
		case reduxActionTypes.SET_CLASS: {
			return {
				...state,
				currentClass: action.payload
			}
		}
		case reduxActionTypes.SET_DATA: {
			return {
				...state,
				data: {
					...state.data,
					[action.payload.classCode]: action.payload.data
				},
				traits: {
					...state.traits,
					[action.payload.classCode]: action.payload.traits
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
