import * as React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { GroupContainer, TransitionContainer } from './style'

interface Props {
	currentKey: string | number
	timeout?: number
	shift?: boolean
	className?: string
}

const FadeContainer: React.SFC<Props> = props => {
	const { currentKey, children, timeout, shift, className } = props

	return (
		<TransitionGroup component={GroupContainer} shift={shift} timeout={timeout}>
			<CSSTransition key={currentKey} classNames="fade" timeout={timeout || 500} unmountOnExit>
				<TransitionContainer shift={shift} timeout={timeout} className={className}>
					{children}
				</TransitionContainer>
			</CSSTransition>
		</TransitionGroup>
	)
}

export default React.memo(FadeContainer)
