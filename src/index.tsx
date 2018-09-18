import 'regenerator-runtime/runtime'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import store from '@src/store/redux'

import App from './app'
import ErrorBoundary from './ErrorBoundary'

if (module.hot) {
	module.hot.accept()
}

const Root: React.SFC = () => (
	<ErrorBoundary>
		<Provider store={store()}>
			<BrowserRouter>
				<Route component={App} />
			</BrowserRouter>
		</Provider>
	</ErrorBoundary>
)

const EnsureIntl = new Promise(async resolve => {
	if (!global.Intl) {
		await require(['intl'], Intl => {
			global.Intl = Intl
		})
	}
	resolve()
})

EnsureIntl.then(() => {
	ReactDOM.render(<Root />, document.getElementById('root'))
})
