import {combineReducers} from 'redux-immutable'
import {Map, fromJS} from 'immutable'
import * as actionType from './actionTypes'

import trainer from './components/trainer/reducer'
import trainer2 from './components/trainer2/reducer'
import mixer from './components/mixer/reducer'
import character from './components/character/reducer'
import home from './components/home/reducer'
import rankings from './components/rankings/reducer'

function general(state = fromJS({uiText: {}, orders: {}, language: 'en', user: null, loading: false, news: Map()}), action) {
    switch (action.type) {
        case actionType.SET_UI_TEXT:
            return state.mergeIn(['uiText'], fromJS(action.ui))
        case actionType.SET_ORDERS:
            return state.mergeIn(['orders'], fromJS(action.orders))
        case actionType.SET_LANGUAGE:
            return state.set('language', fromJS(action.language))
        case actionType.SET_USER:
            return state.set('user', fromJS(action.user))
        case actionType.SET_LOADING:
            return state.set('loading', action.loading)
        case actionType.SET_NEWS:
            return state.set('news', fromJS(action.news))
        default:
            return state
    }
}

export default combineReducers({general, trainer, trainer2, mixer, character, home, rankings})
