import styled, { media } from '@style/styled-components'

export const TraitListcontainer = styled.div`
	overflow: hidden;
	max-width: 120rem;
	margin: 0 auto;
	padding-top: 1rem;
`

export const TraitGroup = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 2rem;
	margin-bottom: 3rem;

	& > div {
		min-width: 0;
	}

	${media.xs`
		grid-gap: 1rem;
		margin-bottom: 2rem;
	`}
`
