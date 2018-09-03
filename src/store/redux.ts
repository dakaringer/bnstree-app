import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from './rootReducer'
import sagas from './rootSaga'

export default () => {
	const sagaMiddleware = createSagaMiddleware()
	const composeEnhancers = composeWithDevTools(applyMiddleware(sagaMiddleware))
	const store = createStore(rootReducer, {}, composeEnhancers)
	// let sagaTask = sagaMiddleware.run(sagas)
	sagaMiddleware.run(sagas)

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./rootReducer', () => {
			const nextRootReducer = require('./rootReducer')
			store.replaceReducer(nextRootReducer)
		})
		// module.hot.accept('./rootSaga', () => {
		// 	const newSagas = require('./rootSaga')
		// 	sagaTask.cancel()
		// 	sagaTask.done.then(() => {
		// 		sagaTask = sagaMiddleware.run(newSagas)
		// 	})
		// })
	}

	return store
}
