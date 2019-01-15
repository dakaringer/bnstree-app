import styled, { css } from '@style/styled-components'

export const Tag = styled.span<{ disabled?: boolean }>`
	display: inline-block;
	padding: 0 0.5rem;
	border-radius: 0.3rem;
	background: ${props => (props.disabled ? props.theme.palette.grey : '#0d47a1')};
	${props =>
		props.disabled &&
		css`
			color: ${props.theme.palette.disabled};
		`}
	margin-right: 0.6rem;
	margin-bottom: 0.6rem;
`
