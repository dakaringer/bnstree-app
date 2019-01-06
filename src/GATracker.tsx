import * as React from 'react'
import * as ReactGA from 'react-ga'

interface Props {
	location: string
}

class GATracker extends React.Component<Props> {
	componentDidMount = () => {
		if (process.env.GA_TRACKER) {
			ReactGA.initialize(process.env.GA_TRACKER)
		}
		const page = this.props.location
		this.trackPage(page)
	}

	componentDidUpdate = (prevProps: Props) => {
		const currentPage = this.props.location
		const prevPage = prevProps.location

		if (currentPage !== prevPage) {
			this.trackPage(currentPage)
		}
	}

	trackPage = (page: string) => {
		ReactGA.set({ page })
		ReactGA.pageview(page)
	}

	render = () => {
		const { children } = this.props
		return children
	}
}

export default GATracker
