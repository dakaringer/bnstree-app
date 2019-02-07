import styled, { media } from '@style/styled-components'
import FadeContainer from '@components/FadeContainer'

export const Content = styled(FadeContainer)`
	padding: 2rem 4rem 10rem;
	box-sizing: border-box;

	${media.xs`
		padding: 1rem;
	`}
`

export const Nav = styled.div`
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
`
