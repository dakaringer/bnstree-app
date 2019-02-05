import styled, { media } from '@style/styled-components'

export const InputContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 2rem;

	${media.xs`
		grid-template-columns: 1fr;
	`}

	& img {
		height: 1.8rem;
		margin-right: 1rem;
	}

	& svg {
		margin: 0 0.5rem;
	}

	& .element-input {
		width: calc(100% - 2.8rem);
	}
`
