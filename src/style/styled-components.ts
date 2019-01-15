import * as styledComponents from 'styled-components'
import { ThemedStyledComponentsModule } from 'styled-components'

import { styledTheme } from './theme'
import media from './breakpoints'

const {
	default: styled,
	css,
	createGlobalStyle,
	keyframes,
	ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<typeof styledTheme>

export { css, createGlobalStyle, keyframes, ThemeProvider, media }
export default styled
