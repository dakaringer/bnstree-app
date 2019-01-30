import styled from '@style/styled-components'
import ImageLoader from '@components/ImageLoader'

export const SkillListElementContainer = styled.div`
	display: grid;
	grid-template-columns: 5.2rem 1fr;
	grid-gap: 0 1rem;
	padding: 1rem;
`

export const SkillIcon = styled.div`
	grid-row: 1 / 3;

	& img {
		width: 5.2rem;
		height: 5.2rem;
	}
`

export const KeyIcon = styled(ImageLoader)`
	height: 1em;
	margin-left: 1rem;
	margin-bottom: -0.2rem;
`

export const SkillLabel = styled.div`
	margin-top: -0.5rem;
	opacity: 0.8;

	& img {
		height: 1.6rem;
		margin-right: 0.5rem;
		vertical-align: middle;
	}
`
