import { createGlobalStyle } from './styled-components'

export default createGlobalStyle`
	& html {
		font-size: 62.5%;
		margin: 0;
		padding: 0;
	}

	& body {
		font-size: 1.6rem;
		margin: 0;
		padding: 0 !important;
		font-family: 'Open Sans', 'system-ui', sans-serif;
		font-weight: 300;
		color: #eeeeee;
		background: #111111;
	}

	& a {
		color: inherit;
		text-decoration: none;

		&:focus {
			outline: none;
		}
	}
`
