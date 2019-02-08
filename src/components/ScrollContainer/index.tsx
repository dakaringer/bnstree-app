import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useRender } from '@utils/hooks'

interface Props {
	className?: string
}

const ScrollContainer: React.FC<Props> = props => {
	const { children, className } = props

	return (
		<Scrollbars
			universal
			autoHide
			hideTracksWhenNotNeeded
			autoHideDuration={500}
			renderThumbVertical={useRender(thumbProps => (
				<div
					{...thumbProps}
					style={{
						...thumbProps.style,
						background: 'rgba(120, 120, 120, 0.8)'
					}}
				/>
			))}
			renderTrackVertical={useRender(trackProps => (
				<div
					{...trackProps}
					style={{
						...trackProps.style,
						width: '1rem',
						right: 0,
						top: 0,
						bottom: 0,
						zIndex: 100
					}}
				/>
			))}
			style={{ height: '100%' }}
			className={className}>
			{children}
		</Scrollbars>
	)
}

export default ScrollContainer
