import styled from '@style/styled-components'

export const SkillNameContainer = styled.span`
	color: aqua;
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	& img {
		height: 1.2em;
		width: 1.2em;
		margin-right: 0.3em;
		vertical-align: middle;
	}
`
