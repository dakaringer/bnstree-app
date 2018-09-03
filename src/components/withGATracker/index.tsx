import * as React from 'react'
import * as ReactGA from 'react-ga'

if (process.env.GA_TRACKER) {
	ReactGA.initialize(process.env.GA_TRACKER)
}

interface Props {
	location: {
		pathname: string
	}
}

export default (Component: React.ComponentType) => {
	const trackPage = (page: string) => {
		ReactGA.set({ page })
		ReactGA.pageview(page)
	}

	return class extends React.Component<Props> {
		componentDidMount() {
			const page = this.props.location.pathname
			trackPage(page)
		}

		componentDidUpdate(prevProps: Props) {
			const currentPage = this.props.location.pathname
			const prevPage = prevProps.location.pathname

			if (currentPage !== prevPage) {
				trackPage(currentPage)
			}
		}

		render() {
			return <Component {...this.props} />
		}
	}
}
