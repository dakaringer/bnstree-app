import styled, { media } from '@style/styled-components'

export const InputContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 2rem;

	${media.xs`
		grid-template-columns: 1fr;
	`}

	& svg {
		margin: 0 0.5rem;
	}
`
