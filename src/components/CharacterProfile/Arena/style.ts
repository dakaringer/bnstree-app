import styled, { media } from '@style/styled-components'

export const ArenaContainer = styled.div`
	width: 100%;
	max-width: 30rem;
	display: grid;
	grid-gap: 1.5rem 0.5rem;
	grid-template-columns: 1fr 1fr;

	${media.xs`
		margin-top: -2rem;
	`}

	& .stats {
		grid-column: 1 / 3;
	}
`

export const GameMode = styled.div`
	display: flex;
	align-items: center;
	padding: 0.5rem;

	&& img {
		margin-right: 1em;
		height: 3.6rem;
	}
`
