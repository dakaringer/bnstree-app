import { css, FlattenInterpolation } from 'styled-components'

type Breakpoint = 'lg' | 'md' | 'sm' | 'xs'
type MediaObject = { [B in Breakpoint]: (...arg: ArgumentsType<typeof css>) => FlattenInterpolation<any> }
const breakpoints: { [B in Breakpoint]: number } = {
	lg: 1600,
	md: 1280,
	sm: 960,
	xs: 650
}

export default (Object.keys(breakpoints) as Breakpoint[]).reduce(
	(acc, label) => {
		acc[label] = (...args: ArgumentsType<typeof css>) => css`
			@media (max-width: ${breakpoints[label] - 1}px) {
				${css(...args)}
			}
		`
		return acc
	},
	{} as MediaObject
)
