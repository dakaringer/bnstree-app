import React from 'react'
import Raven from 'raven-js'
import { IS_DEV } from '@utils/constants'

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

		if (!IS_DEV && process.env.SENTRY_DSN) {
			Raven.config(process.env.SENTRY_DSN).install()
		}
	}

	componentDidCatch = (error: Error) => {
		if (error.message.startsWith('Loading chunk')) {
			location.reload()
			return
		}
		this.setState({ hasError: true })
		const state = store.getState()
		Raven.captureException(error, {
			extra: {
				user: state.user
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
