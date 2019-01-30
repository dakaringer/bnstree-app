import styled, { media } from '@style/styled-components'

export const TraitListElementContainer = styled.div<{ active?: boolean }>`
	display: flex;
	padding: 1rem;
	min-width: 0;
	cursor: pointer;
	border: 0.1rem solid ${props => (props.active ? 'rgba(0, 255, 255, 0.8)' : 'transparent')};

	${media.xs`
		flex-direction: column;
		align-items: center;
	`}

	& button {
		margin-right: 1rem;

		${media.xs`
			margin-bottom: 0.5rem;
			margin-right: 0;
		`}

		& img {
			width: 5.2rem;
			height: 5.2rem;

			${media.xs`
				width: 4rem;
				height: 4rem;
			`}
		}
	}
`
