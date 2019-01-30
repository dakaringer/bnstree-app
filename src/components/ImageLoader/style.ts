import styled from '@style/styled-components'

export const ImageContainer = styled.img<{ loaded: boolean }>`
	transition: opacity 0.5s ease-in-out;
	opacity: ${props => (props.loaded ? 1 : 0)};
	border-radius: 0.3rem;
`
