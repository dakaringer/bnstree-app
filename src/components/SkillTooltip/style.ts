import styled from '@style/styled-components'

export const TooltipTitle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`

export const SkillIcon = styled.div`
	position: relative;

	& > p {
		position: absolute;
		top: 0;
		left: 0.4rem;
		text-shadow: 0 0.1rem 0.2rem #000000;
	}
`
