import styled, { media } from '@style/styled-components'

export const NavigationContainer = styled.div`
	min-height: 100vh;
	height: 100vh;
	display: flex;

	${media.xs`
		height: auto;
	`}
`
