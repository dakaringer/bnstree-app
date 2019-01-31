import React from 'react'
import Scrollbars, { positionValues } from 'react-custom-scrollbars'
import { useCallback } from '@utils/hooks'

interface Props {
	height?: string
	flex?: boolean
	className?: string
	onScroll?: (value: positionValues) => void
}

const ScrollContainer: React.FC<Props> = props => {
	const { height, flex, children, className, onScroll } = props

	return (
		<Scrollbars
			autoHide
			hideTracksWhenNotNeeded
			autoHideDuration={500}
			renderThumbVertical={useCallback(thumbProps => (
				<div {...thumbProps} style={{ background: 'rgba(120, 120, 120, 0.8)' }} />
			))}
			renderTrackVertical={useCallback(trackbProps => (
				<div
					{...trackbProps}
					style={{
						...trackbProps.style,
						width: '1.2rem',
						right: 0,
						top: 0,
						bottom: 0,
						zIndex: 100
					}}
				/>
			))}
			onScrollFrame={onScroll ? value => onScroll(value) : () => null}
			style={{ height, flex: flex ? 1 : undefined }}
			className={className}>
			{children}
		</Scrollbars>
	)
}

export default ScrollContainer
