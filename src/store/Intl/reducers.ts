import { reduxActionTypes } from './actionTypes'
import { Intl } from './types'
import { ReduxAction } from './actions'

export type State = DeepReadonly<Intl>

const initialState = {
	messages: {},
	isLoading: false
}

export default (state: State = initialState, action: ReduxAction) => {
	switch (action.type) {
		case reduxActionTypes.SET_MESSAGES: {
			return {
				...state,
				messages: {
					...state.messages,
					[action.payload.locale]: action.payload.messages
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
