import { reduxActionTypes } from './actionTypes'
import { Skills } from './types'
import { ReduxAction } from './actions'

import { ClassCode } from '@store'

export type State = DeepReadonly<Skills>

const initialState = {
	currentClass: 'BM' as ClassCode,
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
	isLoading: false
}

export default (state: State = initialState, action: ReduxAction) => {
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
