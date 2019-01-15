import styled from '@style/styled-components'

export const ItemListElementContainer = styled.div`
	display: grid;
	grid-template-columns: 5rem 1fr;
	grid-gap: 0.3rem 1rem;
	padding: 1rem;
`

export const ItemIcon = styled.div`
	grid-row: 1 / 3;

	& img {
		width: 5rem;
		height: 5rem;
	}
`

export const ClassLabel = styled.div`
	display: flex;
	align-items: center;

	& img {
		margin-right: 0.5rem;
		height: 1.2em;
	}
`
