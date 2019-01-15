import styled, { media } from '@style/styled-components'

export const ItemListContainer = styled.div`
	overflow: hidden;
	max-width: 120rem;
	margin: 0 auto;
`

export const ItemListGroup = styled.div`
	& > h6 {
		margin: 0.8rem 0;
	}

	& > div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 2rem;
		margin-bottom: 3rem;

		${media.xs`
			grid-template-columns: 1fr;
		`}
	}
`
