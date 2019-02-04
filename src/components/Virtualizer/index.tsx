import React, { useState } from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import { Fade } from '@material-ui/core'
import { useCallback } from '@utils/hooks'

interface Props {
	minHeight?: string
}

const Virtualizer: React.FC<Props> = props => {
	const [visible, setVisible] = useState(false)

	const { minHeight, children } = props

	return (
		<VisibilitySensor
			offset={{ top: -1000, bottom: -1000 }}
			onChange={useCallback((isVisible: boolean) => {
				if (isVisible) {
					setVisible(true)
				}
			})}
			active={!visible}>
			<div style={{ minHeight: minHeight || 0 }}>
				<Fade in={visible} timeout={500} unmountOnExit>
					{children}
				</Fade>
			</div>
		</VisibilitySensor>
	)
}

export default Virtualizer
