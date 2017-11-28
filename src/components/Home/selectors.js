import {List} from 'immutable'

export const listSelector = state => state.getIn(['home', 'twitter'], List())
