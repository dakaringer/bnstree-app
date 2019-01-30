import React from 'react'
import Raven from 'raven-js'

import store from '@store/redux'

interface State {
	hasError: boolean
}

class ErrorBoundary extends React.PureComponent<{}, State> {
	constructor(props: {}) {
		super(props)
		this.state = {
			hasError: false
		}

		if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') && process.env.SENTRY_DSN) {
			Raven.config(process.env.SENTRY_DSN).install()
		}
	}

	componentDidCatch = (error: Error) => {
		if (error.message.startsWith('Loading chunk')) {
			location.reload()
			return
		}
		this.setState({ hasError: true })
		Raven.captureException(error, {
			extra: {
				store: store.getState()
			}
		})
	}

	render = () => {
		const { children } = this.props
		const { hasError } = this.state

		return hasError ? (
			<div>
				<h1>Something went wrong...</h1>
			</div>
		) : (
			children
		)
	}
}

export default ErrorBoundary
