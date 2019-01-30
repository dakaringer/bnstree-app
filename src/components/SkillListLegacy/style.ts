import styled, { media } from '@style/styled-components'

export const SkillListContainer = styled.div`
	overflow: hidden;
	max-width: 120rem;
	margin: 0 auto;
`

export const SkillListGroup = styled.div`
	& > h6 {
		margin: 0.8rem 0;
	}

	& > div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 2rem;
		margin-bottom: 3rem;

		${media.sm`
			grid-template-columns: 1fr;
		`}
	}
`
