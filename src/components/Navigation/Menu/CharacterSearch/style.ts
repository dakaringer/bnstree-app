import styled from '@style/styled-components'

export const CharacterSearchContainer = styled.div`
	box-sizing: border-box;
	display: flex;
	align-items: center;

	& .autosuggest-container {
		position: relative;
		flex: 1;
		width: 100%;
	}

	& .suggestions-container {
		position: absolute;
		z-index: 10;
		left: 0;
		right: 0;
	}

	& .suggestions-list {
		margin: 0;
		padding: 0;
		list-style-type: none;
	}
`

export const SuggestionMenuItem = styled.div`
	font-size: 1.4rem;
	padding: 0.5rem 1rem;
`
