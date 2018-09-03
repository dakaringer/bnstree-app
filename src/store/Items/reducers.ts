import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { Items } from './types'
import Actions from './actions'

export type State = DeepReadonly<Items>

const initialState = {
	data: {
		SOULBADGE: null,
		MYSTICBADGE: null,
		SOULSHIELD: null
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
					[action.payload.itemType]: action.payload.data
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
