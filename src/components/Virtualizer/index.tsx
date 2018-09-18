import * as React from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import { Fade } from '@material-ui/core'

interface Props {
	minHeight?: string
}

interface State {
	visible: boolean
}

class Virtualizer extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	render() {
		const { minHeight, children } = this.props
		const { visible } = this.state

		return (
			<VisibilitySensor
				offset={{ top: -1000, bottom: -1000 }}
				onChange={(isVisible: boolean) => {
					if (isVisible) this.setState({ visible: true })
				}}
				active={!visible}>
				<div style={{ minHeight: minHeight || 0 }}>
					<Fade in={visible} timeout={1000} unmountOnExit>
						{children}
					</Fade>
				</div>
			</VisibilitySensor>
		)
	}
}

export default Virtualizer
