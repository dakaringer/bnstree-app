import styled, { media } from '@style/styled-components'

export const CharacterLayout = styled.div`
	margin-top: 2rem;
	display: grid;
	grid-gap: 2rem;
	grid-template-columns: 2fr 1fr 1fr;

	& > * {
		align-self: start;
	}

	${media.lg`
		grid-template-columns: 1fr 1fr;

		& .equipment {
			grid-column: 1 / 3;
		}
	`}

	${media.xs`
		grid-template-columns: 1fr;

		& .equipment {
			grid-column: 1 / 2;
		}
	`}

	& > div {
		min-width: 0;
	}
`
