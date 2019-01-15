import * as React from 'react'
import { Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import { Drawer, Typography, List, SwipeableDrawer, Hidden } from '@material-ui/core'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ScrollContainer from '@components/ScrollContainer'
import menuLinks from '@components/Navigation/links'
import ProfileButton from './components/ProfileButton'

import { MenuContainer, MenuContent, CharacterSearch, LinkItem } from './style'
import logo from './images/logo.png'

interface Props extends RouteComponentProps<{}> {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

interface State {
	linkPath: typeof menuLinks
}

class Menu extends React.PureComponent<Props, State> {
	state: State = {
		linkPath: []
	}

	componentDidUpdate = (prevProps: Props) => {
		const { location } = this.props
		if (prevProps.location.pathname !== location.pathname) {
			this.setState({
				linkPath: []
			})
		}
	}

	openSubMenu = (linkObject: typeof menuLinks[0]) => {
		const { onClose } = this.props
		const { linkPath } = this.state

		if (linkPath.slice(-1)[0] === linkObject) {
			return null
		}

		if (linkObject.subMenu) {
			this.setState({
				linkPath: [...linkPath, linkObject]
			})
		} else {
			onClose()
		}
	}

	back = () => {
		const { linkPath } = this.state

		this.setState({
			linkPath: linkPath.slice(0, -1)
		})
	}

	renderContent = () => {
		const { location, onClose } = this.props
		const { linkPath } = this.state

		const year = new Date().getFullYear()

		const currentLink = linkPath.slice(-1)[0]
		const linkList = (currentLink && currentLink.subMenu) || menuLinks
		const baseUri = linkPath.map(linkObject => linkObject.link).join('/')

		return (
			<MenuContainer>
				<Link to="/" onClick={onClose}>
					<ImageLoader src={logo} />
				</Link>
				<MenuContent currentKey={currentLink ? currentLink.link : ''}>
					{!currentLink && (
						<>
							<ProfileButton onSelect={this.openSubMenu} />
							<CharacterSearch onSubmit={onClose} />
						</>
					)}
					<ScrollContainer flex>
						<List>
							{currentLink && (
								<LinkItem className="back" onClick={this.back}>
									<ChevronLeft />
									<Typography variant="caption" color="inherit">
										<T id="navigation.menu.back" />
									</Typography>
								</LinkItem>
							)}
							{linkList.map(linkObject => {
								if (linkObject.render) {
									return (
										<React.Fragment key={linkObject.link}>
											{linkObject.render(() => this.setState({ linkPath: [] }))}
										</React.Fragment>
									)
								}

								const link = `${baseUri !== '' ? '/' : ''}${baseUri}/${linkObject.link}`
								const active = link.split('/').reduce((acc, path, i) => {
									return acc && location.pathname.split('/')[i] === path
								}, true)
								return (
									<LinkItem
										key={linkObject.link}
										active={active}
										onClick={() => this.openSubMenu(linkObject)}
										component={
											!linkObject.subMenu
												? (props: any) => (
														<NavLink to={link} activeClassName="active" {...props} />
												  )
												: 'div'
										}
										disabled={linkObject.disabled}>
										{linkObject.icon && <img src={linkObject.icon} />}
										<T id={linkObject.label} />
										{linkObject.subMenu && <ChevronRight />}
									</LinkItem>
								)
							})}
						</List>
					</ScrollContainer>
				</MenuContent>
				<Typography variant="caption" color="textSecondary">
					<p>&copy; BnSTree {year}. All rights reserved.</p>
				</Typography>
			</MenuContainer>
		)
	}

	render = () => {
		const { isOpen, onOpen, onClose } = this.props

		return (
			<>
				<Hidden lgUp>
					<SwipeableDrawer open={isOpen} onOpen={onOpen} onClose={onClose}>
						{this.renderContent()}
					</SwipeableDrawer>
				</Hidden>
				<Hidden mdDown>
					<Drawer variant="permanent">{this.renderContent()}</Drawer>
				</Hidden>
			</>
		)
	}
}

export default withRouter(Menu)
