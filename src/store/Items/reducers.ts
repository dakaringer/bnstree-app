import { reduxActionTypes } from './actionTypes'
import { Items } from './types'
import { ReduxAction } from './actions'

import { ItemType } from '@store'

export type State = DeepReadonly<Items>

const initialState = {
	currentType: 'SOULBADGE' as ItemType,
	data: {
		SOULBADGE: null,
		MYSTICBADGE: null,
		SOULSHIELD: null
	},
	isLoading: false
}

export default (state: State = initialState, action: ReduxAction) => {
	switch (action.type) {
		case reduxActionTypes.SET_TYPE: {
			return {
				...state,
				currentType: action.payload
			}
		}
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
