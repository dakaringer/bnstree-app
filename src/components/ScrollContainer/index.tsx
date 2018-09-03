import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'

interface Props {
	height: string
	disabled?: boolean
	className?: string
	onScroll?: (value: {}) => void
}

const ScrollContainer: React.SFC<Props> = props => {
	const { height, disabled, children, className, onScroll } = props
	if (disabled) return <div className={className}>{children}</div>

	return (
		<Scrollbars
			autoHide
			hideTracksWhenNotNeeded
			autoHideDuration={500}
			renderThumbVertical={props => <div {...props} style={{ background: 'rgba(120, 120, 120, 0.8)' }} />}
			renderTrackVertical={props => (
				<div
					{...props}
					style={{
						...props.style,
						width: '1.2rem',
						right: 0,
						top: 0,
						bottom: 0,
						zIndex: 100
					}}
				/>
			)}
			onScrollFrame={onScroll ? value => onScroll(value) : () => null}
			style={{ height }}
			className={className}>
			{children}
		</Scrollbars>
	)
}

export default ScrollContainer
