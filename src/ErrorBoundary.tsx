import * as React from 'react'
import * as Raven from 'raven-js'

interface Props {}

interface State {
	hasError: boolean
}

class ErrorBoundary extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			hasError: false
		}

		if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') && process.env.SENTRY_DSN) {
			Raven.config(process.env.SENTRY_DSN).install()
		}
	}

	componentDidCatch(error: Error) {
		this.setState({
			hasError: true
		})
		Raven.captureException(error)
	}

	render() {
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
