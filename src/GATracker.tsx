import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useCallback } from '@utils/hooks'

interface Props {
	location: string
}

const GATracker: React.FC<Props> = props => {
	useEffect(() => {
		const { location } = props
		if (process.env.GA_TRACKER) {
			ReactGA.initialize(process.env.GA_TRACKER)
		}
		trackPage(location)
	}, [])

	useEffect(() => {
		const { location } = props
		trackPage(location)
	})

	const trackPage = useCallback((page: string) => {
		ReactGA.set({ page })
		ReactGA.pageview(page)
	})

	const { children } = props
	return <>{children}</>
}

export default GATracker
