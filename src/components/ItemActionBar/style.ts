import styled, { media, css } from '@style/styled-components'

export const ItemActionBarContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 30vw 1fr;

	${media.sm`
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-auto-flow: column;
	`}
`

export const MenuItemContainer = styled.div`
	font-size: 1.4rem;
	text-transform: uppercase;

	& img {
		height: 1.5em;
		margin-right: 1rem;
		vertical-align: middle;
	}
`

export const BarGroup = styled.div<{ align?: 'left' | 'right' }>`
	display: flex;
	align-items: center;
	flex: 1;
	color: var(--text-secondary);

	&& > * {
		${props => (props.align === 'right' ? 'margin-left' : 'margin-right')}: 2rem;
	}

	${props =>
		props.align === 'right' &&
		css`
			color: ${props.theme.palette.textSecondary};
			justify-self: end;
		`}

	& button {
		& img {
			height: 1.5em;
			margin-right: 1rem;
		}

		& span {
			white-space: nowrap;
		}
	}
`

export const SearchContainer = styled.div`
	padding: 0.3rem 1.8rem;
	padding-right: 1.2rem;
	background: ${props => props.theme.palette.blackGlass};
	border-radius: 1.5em;

	${media.sm`
		grid-row: 2;
		grid-column: 1 / 3;
		margin: 1rem -2rem -1rem;
		padding-left: 3.3rem;
		padding-right: 2rem;
		border-radius: 0;
	`}

	${media.xs`
		margin-left: -1rem;
		margin-right: -1rem;
		padding-left: 2.3rem;
		padding-right: 1rem;
	`}

	& > div {
		width: 100%;
	}

	& button {
		color: ${props => props.theme.palette.textSecondary};
	}
`
