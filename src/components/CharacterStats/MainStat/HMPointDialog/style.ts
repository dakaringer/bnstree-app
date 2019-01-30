import styled from '@style/styled-components'

export const MainEffect = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	& img {
		margin-right: 1rem;
		vertical-align: middle;
	}
`

export const AdditionalEffectsTable = styled.table`
	margin-top: 1rem;
	width: 100%;
	color: ${props => props.theme.palette.disabled};

	& td:first-child {
		text-align: center;
		padding-right: 2rem;
	}
`

export const AdditionalBuff = styled.div`
	margin-top: 1rem;
	display: flex;
	align-items: center;

	& img {
		margin-right: 1rem;
	}
`
