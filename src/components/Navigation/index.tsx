import * as React from 'react'
import { ButtonBase, Hidden, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import * as classNames from 'classnames'

import * as style from './styles/index.css'
import Menu from './Menu'

import ScrollContainer from '@src/components/ScrollContainer'

interface Props extends WithWidth {}

interface State {
	menuOpen: boolean
}

interface Navigation {
	menuContainer: React.RefObject<HTMLDivElement>
}

class Navigation extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.menuContainer = React.createRef()
		this.state = {
			menuOpen: false
		}
	}

	toggleMenu = () => {
		const { menuOpen } = this.state
		this.setState({ menuOpen: !menuOpen })
	}

	render() {
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
							MENU
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
