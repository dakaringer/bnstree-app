import 'regenerator-runtime/runtime'
import ensurePolyfill from './polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import store from '@store/redux'

import App from './App'
import ErrorBoundary from './ErrorBoundary'
import GlobalStyle from './style/global'

if (module.hot) {
	module.hot.accept()
}

const Root: React.SFC = () => (
	<ErrorBoundary>
		<GlobalStyle />
		<Provider store={store}>
			<BrowserRouter>
				<Route component={App} />
			</BrowserRouter>
		</Provider>
	</ErrorBoundary>
)

ensurePolyfill.then(() => {
	ReactDOM.render(<Root />, document.getElementById('root'))
})
