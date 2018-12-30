import * as React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import * as style from './styles/index.css'

interface Props {
	currentKey: string | number
	timeout?: number
	shift?: boolean
	className?: string
	containerProps?: {}
}

const FadeContainer: React.SFC<Props> = props => {
	const { currentKey, children, timeout, shift, className, containerProps } = props

	const transitionClasses = {
		enter: shift ? style.fadeWithShiftEnter : style.fadeEnter,
		enterActive: style.fadeEnterActive,
		exit: style.fadeExit,
		exitActive: style.fadeExitActive
	}

	return (
		<TransitionGroup
			className={classNames(style.fadeContainer, { [style.withShift]: shift })}
			style={{ animationDuration: timeout ? `${timeout}ms` : '500ms' }}
			{...containerProps}>
			<CSSTransition key={currentKey} classNames={transitionClasses} timeout={timeout || 500} unmountOnExit>
				<div style={{ transitionDuration: timeout ? `${timeout}ms` : '500ms' }} className={className}>
					{children}
				</div>
			</CSSTransition>
		</TransitionGroup>
	)
}

export default React.memo(FadeContainer)
