import * as React from 'react'
import * as Raven from 'raven-js'

interface Props {}

interface State {
	hasError: boolean
}

if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') && process.env.SENTRY_DSN) {
	Raven.config(process.env.SENTRY_DSN).install()
}

export default (Component: React.ComponentType) => {
	return class extends React.PureComponent<Props, State> {
		constructor(props: Props) {
			super(props)
			this.state = {
				hasError: false
			}
		}

		componentDidCatch(error: Error) {
			this.setState({
				hasError: true
			})
			Raven.captureException(error)
		}

		render() {
			const { hasError } = this.state

			return hasError ? <h1>Something went wrong...</h1> : <Component {...this.props} />
		}
	}
}
