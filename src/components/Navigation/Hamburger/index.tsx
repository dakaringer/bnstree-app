import React from 'react'
import { ButtonBase } from '@material-ui/core'

import { HamburgerButton } from './style'

interface Props {
	onClick: () => void
}

const Hamburger: React.FC<Props> = props => {
	const { onClick } = props
	return (
		<ButtonBase component={HamburgerButton} onClick={onClick} centerRipple>
			<div>
				<span />
			</div>
		</ButtonBase>
	)
}

export default Hamburger
