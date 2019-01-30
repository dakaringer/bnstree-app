import { css, ThemedCssFunction } from 'styled-components'
import { styledTheme, muiTheme } from './theme'

const breakpoints = muiTheme.breakpoints.keys

export default breakpoints.reduce(
	(acc, label) => {
		acc[label] = (first: any, ...interpolations: any[]) => css`
			/* stylelint-disable */
			${muiTheme.breakpoints.down(label)} {
				${css(first, ...interpolations)}
			}
		`
		return acc
	},
	{} as { [key: string]: ThemedCssFunction<typeof styledTheme> }
)
