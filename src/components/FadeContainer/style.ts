import styled, { keyframes, css } from '@style/styled-components'

const initialize = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`

const initializeWithShift = keyframes`
	0% {
		opacity: 0;
		transform: translateY(3rem);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
`

export const GroupContainer = styled.div<{
	shift?: boolean
	timeout?: number
}>`
	position: relative;
	animation: ${props => (props.shift ? initializeWithShift : initialize)} ${props => props.timeout || 500}ms ease-out;
	height: 100%;
`

export const TransitionContainer = styled.div<{
	shift?: boolean
	timeout?: number
}>`
	transition: opacity ease-out, transform ease-out;
	transition-duration: ${props => props.timeout || 500}ms;

	&.fade-enter {
		${props =>
			props.shift
				? css`
						position: relative;
						transform: translateY(5rem);
						left: 0;
						width: 100%;
						opacity: 0;
				  `
				: css`
						position: relative;
						left: 0;
						width: 100%;
						opacity: 0;
				  `};
	}

	&.fade-enter-active {
		transform: translateY(0);
		opacity: 1;
	}

	&.fade-exit {
		position: absolute !important;
		transform: translateY(0);
		top: 0;
		left: 0;
		width: 100%;
		opacity: 1;
	}

	&.fade-exit-active {
		opacity: 0;
	}
`
