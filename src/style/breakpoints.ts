import { css, ThemedCssFunction } from 'styled-components'
import { styledTheme, muiTheme } from './theme'

const breakpoints = muiTheme.breakpoints.values

export default (Object.keys(breakpoints) as (keyof typeof breakpoints)[]).reduce(
	(acc, label) => {
		acc[label] = (first: any, ...interpolations: any[]) => css`
			@media (max-width: ${breakpoints[label] - 1}px) {
				${css(first, ...interpolations)}
			}
		`
		return acc
	},
	{} as { [key in keyof typeof breakpoints]: ThemedCssFunction<typeof styledTheme> }
)
