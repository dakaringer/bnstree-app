import styled, { media } from '@style/styled-components'

export const CharacterEquipmentContainer = styled.div`
	padding: 2.5rem;
	display: grid;
	grid-gap: 0.5rem 2rem;
	grid-template-columns: 1fr 1fr;

	${media.xs`
		padding: 1.5rem;
		grid-gap: 1rem;
		grid-template-columns: 1fr;
	`}

	& > div {
		min-width: 0;

		&.accessories {
			grid-row: 2 / 4;
		}
	}
`

export const Weapon = styled.div`
	grid-column: 1 / -1;
	display: grid;
	grid-gap: 0 1rem;
	grid-template-columns: 5rem 1fr;
	grid-template-rows: 1fr 1fr;

	& > img {
		grid-row: 1 / 3;
		width: 100%;
		background: ${props => props.theme.palette.blackGlass};
	}
`

export const Gems = styled.div`
	display: flex;
	flex-wrap: wrap;

	& img {
		height: 2.5rem;
		width: 2.5rem;
		margin-right: 0.2rem;
	}
`

export const Item = styled.div`
	&& {
		margin: 0.5rem 0 1rem;
		display: flex;
		align-items: center;

		& img {
			height: 3.5rem;
			width: 3.5rem;
			background: ${props => props.theme.palette.blackGlass};
			margin-right: 1rem;
		}
	}
`

export const SoulshieldContainer = styled.div`
	align-self: start;
	display: flex;
	align-items: center;
	padding-bottom: 1rem;

	${media.xs`
		margin-top: 2rem;
	`}
`

export const SoulshieldCircle = styled.div`
	position: relative;
	height: 12.5rem;
	width: 12.5rem;
	min-width: 12.5rem;
	margin-right: 1rem;
`

export const SoulshieldPiece = styled.div<{ n: number }>`
	width: 6.5rem;
	position: absolute;

	top: ${props => {
		switch (props.n) {
			case 8:
			case 1:
			case 2:
				return 0
			case 7:
			case 3:
				return 3
			case 6:
			case 5:
			case 4:
				return 6
		}
	}}rem;

	left: ${props => {
		switch (props.n) {
			case 8:
			case 7:
			case 6:
				return 0
			case 1:
			case 5:
				return 3
			case 2:
			case 3:
			case 4:
				return 6
		}
	}}rem;
`
