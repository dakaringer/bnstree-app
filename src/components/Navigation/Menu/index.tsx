import React, { useState, useEffect } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Drawer, Typography, List, ListItem, SwipeableDrawer, Hidden } from '@material-ui/core'
import { ListItemProps } from '@material-ui/core/ListItem'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'
import { useCallback } from '@utils/hooks'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ScrollContainer from '@components/ScrollContainer'
import baseLinks from '@components/Navigation/links'
// import ProfileButton from './ProfileButton'

import { DrawerContainer, MenuContainer, MenuContent, CharacterSearch, LinkItem } from './style'
import logo from './images/logo.png'

interface Props extends RouteComponentProps<{}> {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

const Menu: React.FC<Props> = props => {
	const [linkArray, setLinkArray] = useState<typeof baseLinks>([])

	const { isOpen, location, onOpen, onClose } = props

	useEffect(() => {
		if (linkArray.length > 0) {
			setLinkArray([])
		}
	}, [location.pathname])

	const goBack = useCallback(() => setLinkArray(linkArray.slice(0, -1)))
	const goForward = useCallback((linkObject: typeof baseLinks[0]) => () => {
		if (linkObject.subMenu) {
			setLinkArray([...linkArray, linkObject])
		} else {
			onClose()
		}
	})

	const renderLinkItem = useCallback(
		(linkObject: typeof baseLinks[0], menuLink: string, active: boolean) => (listItemProps: ListItemProps) =>
			!linkObject.subMenu ? (
				<LinkItem active={active ? 1 : undefined} as={Link} to={menuLink} {...listItemProps} />
			) : (
				<LinkItem active={active} {...listItemProps} />
			)
	)

	const year = new Date().getFullYear()

	const topLink = linkArray[linkArray.length - 1]
	const linkList = (topLink && topLink.subMenu) || baseLinks
	const baseUri = '/' + linkArray.map(linkObject => linkObject.link).join('/')

	const content = (
		<MenuContainer>
			<Link to="/" onClick={onClose}>
				<ImageLoader src={logo} />
			</Link>
			<MenuContent currentKey={baseUri}>
				{!topLink && (
					<>
						{/* <ProfileButton onSelect={this.openSubMenu} /> */}
						<CharacterSearch onSubmit={onClose} />
					</>
				)}
				<ScrollContainer>
					<List>
						{!!topLink && (
							<ListItem button component={LinkItem} className="back" onClick={goBack}>
								<ChevronLeft />
								<Typography variant="caption" color="inherit">
									<T id="navigation.menu.back" />
								</Typography>
							</ListItem>
						)}
						{linkList.map(linkObject => {
							const menuLink = baseUri + (baseUri !== '/' ? '/' : '') + linkObject.link
							const active = menuLink
								.split('/')
								.reduce((acc, path, i) => acc && location.pathname.split('/')[i] === path, true)

							return (
								<ListItem
									key={linkObject.link}
									button
									component={renderLinkItem(linkObject, menuLink, active)}
									onClick={goForward(linkObject)}
									disabled={linkObject.disabled}>
									{linkObject.icon && <img src={linkObject.icon} />}
									<T id={linkObject.label} />
									{linkObject.subMenu && <ChevronRight />}
								</ListItem>
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

	return (
		<>
			<Hidden lgUp>
				<SwipeableDrawer open={isOpen} onOpen={onOpen} onClose={onClose}>
					{content}
				</SwipeableDrawer>
			</Hidden>
			<Hidden mdDown>
				<Drawer variant="permanent" PaperProps={{ component: DrawerContainer }}>
					{content}
				</Drawer>
			</Hidden>
		</>
	)
}

export default withRouter(Menu)
