import styled, { css, media } from '@style/styled-components'

export const HamburgerButton = styled.button<{ active?: boolean }>`
	&& {
		padding: 0.5rem;
		position: fixed;
		z-index: 1200;
		top: 2.3rem;
		left: -0.8rem;
		transform-origin: 50% 0;
		letter-spacing: 0.5rem;
		color: ${props => props.theme.palette.textSecondary};
		border: 0;
		margin: 0;
		outline: none;

		${media.xs`
			top: 1.8rem;
		`}
	}

	&:hover {
		opacity: 0.8;
	}

	& > div {
		width: 1.5rem;
		height: 1rem;
		display: inline-block;
		vertical-align: middle;
		position: relative;

		& > span {
			&::before,
			&::after {
				width: 1.5rem;
				height: 0.2rem;
				background-color: ${props => props.theme.palette.textSecondary};
				position: absolute;
				display: block;
				content: '';
			}

			&::before {
				top: 0.1rem;
			}

			&::after {
				bottom: 0.1rem;
			}

			${props =>
				props.active &&
				css`
					&::before {
						top: 0.45rem;
						transform: rotate(45deg);
					}
					&::after {
						bottom: 0.45rem;
						transform: rotate(-45deg);
					}
				`}
		}
	}
`
