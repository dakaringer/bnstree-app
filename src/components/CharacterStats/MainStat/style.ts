import styled from '@style/styled-components'

export const MainStatContainer = styled.div<{ type: 'attack' | 'defense' }>`
	background: linear-gradient(
		0deg,
		${props => (props.type === 'attack' ? 'rgba(150, 20, 20, 0.5)' : 'rgba(40, 70, 130, 0.5)')} 10%,
		${props => props.theme.palette.blackGlass} 120%
	);

	& > div {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 2.4rem 2rem 0.5rem;
		& h4 {
			font-weight: 300;
		}
	}
`

export const HMPointButton = styled.button`
	&& {
		width: 100%;
		justify-content: space-between;
		background: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1.6rem;
	}

	& img {
		vertical-align: bottom;
	}
`

export const HMPointBuff = styled.span<{ disabled?: boolean }>`
	margin-left: 1rem;
	opacity: ${props => (props.disabled ? 0.5 : 1)};

	& img {
		margin-right: 0.3rem;
	}
`
