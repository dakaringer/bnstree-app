import styled from '@style/styled-components'

import GoogleLogoSVG from './images/GoogleLogo.svg'
import GoogleLogoPressedSVG from './images/GoogleLogo-pressed.svg'

export const ProfileButton = styled.li`
	&& {
		height: 5.4rem;
		padding: 1.5rem;
		display: none;
	}
`

export const GoogleLogo = styled(GoogleLogoSVG)`
	height: 4rem;
	width: 4rem;
	position: absolute;
	top: -5px;
	left: -5px;
	transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`

export const GoogleLogoPressed = styled(GoogleLogoPressedSVG)`
	height: 4rem;
	width: 4rem;
	position: absolute;
	top: -5px;
	left: -5px;
	transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	opacity: 0;
`

export const GoogleLoginButton = styled.li`
	background-color: white;
	color: black;
	text-transform: none;
	transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;

	& > span {
		position: relative;
		width: 30px;
		height: 30px;
		overflow: hidden;
		margin-right: 0.5rem;
	}

	&:hover {
		background-color: #eee;

		& ${GoogleLogoPressed} {
			opacity: 1;
		}
	}
`
