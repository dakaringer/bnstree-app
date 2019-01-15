import * as React from 'react'

import { ModTextContainer } from './style'

interface Props {
	flag?: 'add' | 'mod' | 'del'
	className?: string
}

const ModText: React.SFC<Props> = props => {
	const { flag, className, children } = props

	return (
		<ModTextContainer flag={flag} className={className}>
			{children}
		</ModTextContainer>
	)
}

export default React.memo(ModText)
