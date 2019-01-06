import * as React from 'react'
import { ButtonBase, Hidden, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import classNames from 'classnames'

import style from './styles/index.css'
import Menu from './Menu'

import ScrollContainer from '@src/components/ScrollContainer'

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
				<div className={style.navigation}>
					<ScrollContainer height="100%" disabled={isWidthDown('xs', width)}>
						{children}
					</ScrollContainer>
					<Hidden lgUp>
						<ButtonBase
							centerRipple
							onClick={this.toggleMenu}
							className={classNames(style.menuToggle, style.hamburger, style.hamburgerSqueeze, {
								[style.isActive]: menuOpen
							})}>
							<div className={style.hamburgerBox}>
								<span className={style.hamburgerInner} />
							</div>
						</ButtonBase>
					</Hidden>
				</div>
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
