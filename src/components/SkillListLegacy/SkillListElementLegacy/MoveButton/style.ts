import styled, { css } from '@style/styled-components'

export const MoveButtonContainer = styled.div`
	position: relative;
`

export const StyledMoveButton = styled.button<{
	active?: boolean
	withHM?: boolean
	disabled?: boolean
}>`
	&& {
		width: 100%;
		font-size: 1rem;
		justify-content: flex-start;
		padding: 0.8rem;
		${props => props.withHM && 'padding-right: 3rem;'}

		${props =>
			props.disabled &&
			css`
				border-color: transparent;
				color: ${props.theme.palette.textPrimary} !important;
				filter: brightness(0.7);
			`}

		${props =>
			props.active &&
			css`
				border-color: rgba(0, 255, 255, 0.5);

				& label {
					color: aqua;
				}
			`}
	}

	& img {
		height: 1.6em;
		margin-right: 0.6rem;
	}

	& label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`

export const HMToggle = styled.div<{
	active?: boolean
}>`
	position: absolute;
	top: 0.5rem;
	right: 0.3rem;
	opacity: 0.9;
	width: 2.6rem;
	height: 2.6rem;
	filter: saturate(${props => (props.active ? 1 : 0)}), brightness(0.8);
	display: flex;
	align-items: center;
	justify-content: center;

	& img {
		height: 2.6rem;
	}
`
