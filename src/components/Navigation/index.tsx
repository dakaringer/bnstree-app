import React, { useState } from 'react'
import { Hidden, withWidth } from '@material-ui/core'
import { useCallback } from '@utils/hooks'

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
			<Menu
				isOpen={menuOpen}
				onOpen={useCallback(() => setMenuOpen(true))}
				onClose={useCallback(() => setMenuOpen(false))}
			/>
			<ScrollContainer>{children}</ScrollContainer>
			<Hidden lgUp>
				<Hamburger onClick={useCallback(() => setMenuOpen(true))} />
			</Hidden>
		</NavigationContainer>
	)
}

export default withWidth()(Navigation)
