import {List} from 'immutable'

export const listSelector = state => state.getIn(['streams', 'list'], List())
