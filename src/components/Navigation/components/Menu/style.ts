import styled from '@style/styled-components'

import FadeContainer from '@components/FadeContainer'
import CharacterSearchComponent from './components/CharacterSearch'

export const MenuContainer = styled.div`
	height: 100%;
	width: ${props => props.theme.menuWidth};
	max-width: 100vw;
	border-right: 0.1rem solid ${props => props.theme.palette.blackGlass};
	display: flex;
	flex-direction: column;

	& > div {
		display: flex;
	}

	& > a,
	& > span {
		margin: 1rem;
	}
`

export const MenuContent = styled(FadeContainer)`
	padding-top: 1rem;
	flex: 1;
	display: flex;
	flex-direction: column;
`

export const CharacterSearch = styled(CharacterSearchComponent)`
	margin: 0 1rem 1rem;
	flex-direction: column;
	align-items: flex-start;
`

export const LinkItem = styled.li<{
	active?: boolean
	to?: string
	activeClassName?: string
}>`
	&& {
		padding: 1rem 1.5rem;
		transition: color 0.5s;
		color: ${props => (props.active ? props.theme.palette.primary : props.theme.palette.textSecondary)};
	}

	& > svg {
		height: 0.8em;
	}

	& img {
		height: 1.6em;
		margin-right: 1.2rem;
		filter: saturate(0.2);
	}

	&.back {
		padding-left: 1rem;
	}

	&.active {
		color: ${props => props.theme.palette.primary};
	}
`
