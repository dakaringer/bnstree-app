import styled, { media } from '@style/styled-components'

export const NavigationContainer = styled.div`
	min-height: 100vh;
	height: 100vh;
	padding-left: ${props => props.theme.menuWidth};

	${media.md`
		padding-left: 0rem;
	`}

	${media.xs`
		height: auto;
	`}
`
