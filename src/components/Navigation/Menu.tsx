import * as React from 'react'
import { connect } from 'react-redux'
import { Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import { Drawer, Typography, List, ListItem, SwipeableDrawer, Hidden } from '@material-ui/core'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'
import classNames from 'classnames'
import FadeContainer from '@src/components/FadeContainer'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'
import ScrollContainer from '@src/components/ScrollContainer'
import CharacterSearch from '@src/components/CharacterSearch'
import compose from '@src/utils/compose'

import { RootState } from '@src/store/rootReducer'
import { getData } from '@src/store/User/selectors'

import * as style from './styles/Menu.css'
import logo from './images/logo.png'
import { menuLinks, LinkObject } from './links'
import UserButton from './UserButton'
import LoginButton from './LoginButton'

interface PropsFromStore {
	userData: ReturnType<typeof getData>
}

interface SelfProps {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

interface Props extends SelfProps, PropsFromStore, RouteComponentProps<{}> {}

interface State {
	linkPath: LinkObject[]
}

class Menu extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			linkPath: []
		}
	}

	componentDidUpdate(prevProps: Props) {
		const { location } = this.props
		if (prevProps.location.pathname !== location.pathname) {
			this.setState({
				linkPath: []
			})
		}
	}

	openSubMenu = (linkObject: LinkObject) => {
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
		const { userData, location, onClose } = this.props
		const { linkPath } = this.state

		const year = new Date().getFullYear()

		const currentLink = linkPath.slice(-1)[0]
		const linkList = (currentLink && currentLink.subMenu) || menuLinks
		const baseUri = linkPath.map(linkObject => linkObject.link).join('/')
		return (
			<>
				<Link to="/" className={style.mainLink} onClick={onClose}>
					<ImageLoader src={logo} />
				</Link>
				<div className={style.content}>
					<ScrollContainer height="calc(100% - 6rem)">
						<FadeContainer currentKey={currentLink ? currentLink.link : ''}>
							<List>
								{!currentLink ? (
									<>
										{userData ? (
											<UserButton userData={userData} onSelect={this.openSubMenu} />
										) : (
											<LoginButton onSelect={this.openSubMenu} />
										)}
										<CharacterSearch className={style.characterSearch} onSubmit={onClose} />
									</>
								) : (
									<ListItem button className={classNames(style.link, style.back)} onClick={this.back}>
										<ChevronLeft className={style.arrow} />
										<Typography variant="caption" color="inherit">
											<T id="navigation.menu.back" />
										</Typography>
									</ListItem>
								)}
								{linkList.map(linkObject => {
									if (linkObject.render)
										return (
											<React.Fragment key={linkObject.link}>
												{linkObject.render(() => this.setState({ linkPath: [] }))}
											</React.Fragment>
										)

									const link = `${baseUri !== '' ? '/' : ''}${baseUri}/${linkObject.link}`
									return (
										<ListItem
											key={linkObject.link}
											button
											className={classNames(style.link, {
												[style.active]: location.pathname.startsWith(link)
											})}
											onClick={() => this.openSubMenu(linkObject)}
											component={
												!linkObject.subMenu
													? (props: any) => (
															<NavLink
																to={link}
																activeClassName={style.active}
																{...props}
															/>
													  )
													: 'div'
											}>
											{linkObject.icon && <img src={linkObject.icon} />}
											<T id={linkObject.label} />
											{linkObject.subMenu && <ChevronRight className={style.arrow} />}
										</ListItem>
									)
								})}
							</List>
						</FadeContainer>
					</ScrollContainer>
				</div>
				<Typography variant="caption" className={style.legal}>
					<p>&copy; BnSTree {year}. All rights reserved.</p>
				</Typography>
			</>
		)
	}

	render() {
		const { isOpen, onOpen, onClose } = this.props

		return (
			<>
				<Hidden lgUp>
					<SwipeableDrawer open={isOpen} onOpen={onOpen} onClose={onClose} classes={{ paper: style.menu }}>
						{this.renderContent()}
					</SwipeableDrawer>
				</Hidden>
				<Hidden mdDown>
					<Drawer variant="permanent" classes={{ paper: style.menu }}>
						{this.renderContent()}
					</Drawer>
				</Hidden>
			</>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		userData: getData(state)
	}
}

export default compose<Props, SelfProps>(
	withRouter,
	connect(mapStateToProps)
)(Menu)
