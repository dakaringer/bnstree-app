import styled from '@style/styled-components'

import ModText from '@components/ModText'

export const AttributeContainer = styled(ModText)<{ color?: string }>`
	display: block;
	line-height: 1.2em;
	margin-bottom: 0.2em;
	color: ${props => props.color || 'inherit'};

	& svg {
		margin: -0.4rem;
		font-size: 1.4em;
	}

	& img {
		height: 1.2em;
		width: 1.2em;
		margin-right: 0.3em;
		vertical-align: middle;
	}

	& > img:last-child {
		margin-right: 0;
		margin-left: 0.3em;
	}
`
