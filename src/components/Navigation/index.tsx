import React, { useState } from 'react'
import { Hidden, withWidth } from '@material-ui/core'

import ScrollContainer from '@components/ScrollContainer'
import Hamburger from './Hamburger'
import Menu from './Menu'

import { NavigationContainer } from './style'

interface Props {}

const Navigation: React.FC<Props> = props => {
	const [menuOpen, setMenuOpen] = useState(false)

	const { children } = props

	return (
		<NavigationContainer>
			<Menu isOpen={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} />
			<ScrollContainer>{children}</ScrollContainer>
			<Hidden lgUp>
				<Hamburger onClick={() => setMenuOpen(true)} />
			</Hidden>
		</NavigationContainer>
	)
}

export default withWidth()(Navigation)
