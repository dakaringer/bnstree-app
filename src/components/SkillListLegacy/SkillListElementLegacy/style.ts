import styled, { media } from '@style/styled-components'
import ImageLoader from '@components/ImageLoader'

export const SkillListElementContainer = styled.div`
	display: grid;
	grid-template-columns: 6.4rem 1fr;
	grid-gap: 0.3rem 1rem;
	padding: 1rem;

	${media.sm`
		margin-right: 0;
		grid-template-columns: 3rem 1fr;
		grid-gap: 1rem;
	`}

	& .skill {
		color: aqua;
	}
`

export const SkillIcon = styled.div`
	grid-row: 1 / 3;

	${media.sm`
		grid-row: 1;
	`}

	& img {
		width: 6.4rem;
		height: 6.4rem;

		${media.sm`
			width: 3rem;
			height: 3rem;
		`}
	}
`

export const KeyIcon = styled(ImageLoader)`
	height: 1em;
	margin-left: 1rem;
	margin-bottom: -0.2rem;
`

export const MoveContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 0.5rem;

	& > div {
		min-width: 0;
	}

	${media.sm`
		grid-column: 1 / 3;
	`}

	${media.xs`
		grid-template-columns: 1fr;
	`}
`
