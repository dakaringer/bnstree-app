import React from 'react'

import { ModTextContainer } from './style'

interface Props {
	flag?: 'add' | 'mod' | 'del'
	className?: string
	children: React.ReactNode
}

const ModText: React.FC<Props> = props => {
	const { flag, className, children } = props

	return (
		<ModTextContainer flag={flag} className={className}>
			{children}
		</ModTextContainer>
	)
}

export default ModText
