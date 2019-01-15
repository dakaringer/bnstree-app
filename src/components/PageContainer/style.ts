import styled, { media } from '@style/styled-components'

export const Content = styled.div`
	padding: 2rem 4rem 10rem;

	${media.xs`
		padding: 1rem;
	`}
`

export const Nav = styled.div`
	&& {
		position: sticky;
		top: 0;
		width: 100%;
		background: linear-gradient(to bottom, ${props => props.theme.palette.blackGlass} 0%, transparent 150%);
		padding: 1.5rem 2rem 1rem;
		box-sizing: border-box;
		z-index: 2;

		${media.xs`
			padding: 1rem;
		`}
	}
`
