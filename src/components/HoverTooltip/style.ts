import styled, { media } from '@style/styled-components'

export const Target = styled.div`
	user-select: none;
	touch-action: none;
`

export const TooltipContent = styled.div`
	padding: 0.5rem 1.2rem;
	width: 55rem;
	max-width: calc(100vw - 1rem);
	box-sizing: border-box;
	border: 0.1rem solid ${props => props.theme.palette.grey};
	border-radius: 0.5rem;
`

export const TooltipTitle = styled.div`
	margin-bottom: 0.5rem;
	white-space: nowrap;
`

export const TooltipSection = styled.div`
	margin-bottom: 1rem;
`

export const TooltipMainSection = styled(TooltipSection)`
	display: flex;

	& > img {
		height: 6rem;
		width: 6rem;
		margin-right: 1rem;

		${media.xs`
			width: 5rem;
			height: 5rem;
		`}
	}
`

export const ExtraContainer = styled.div`
	& > div {
		margin-bottom: 1rem;
	}
`
