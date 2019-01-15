import * as React from 'react'
import { Hidden, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'

import ScrollContainer from '@components/ScrollContainer'
import Hamburger from './components/Hamburger'
import Menu from './components/Menu'

import { NavigationContainer } from './style'

interface Props extends WithWidth {}

interface State {
	menuOpen: boolean
}

class Navigation extends React.PureComponent<Props, State> {
	state = {
		menuOpen: false
	}
	menuContainer: React.RefObject<HTMLDivElement> = React.createRef()

	toggleMenu = () => {
		const { menuOpen } = this.state
		this.setState({ menuOpen: !menuOpen })
	}

	render = () => {
		const { width, children } = this.props
		const { menuOpen } = this.state

		return (
			<>
				<NavigationContainer>
					<ScrollContainer height="100%" disabled={isWidthDown('xs', width)}>
						{children}
					</ScrollContainer>
					<Hidden lgUp>
						<Hamburger onClick={this.toggleMenu} />
					</Hidden>
				</NavigationContainer>
				<Menu
					isOpen={menuOpen}
					onOpen={() => this.setState({ menuOpen: true })}
					onClose={() => this.setState({ menuOpen: false })}
				/>
			</>
		)
	}
}

export default withWidth()(Navigation)
