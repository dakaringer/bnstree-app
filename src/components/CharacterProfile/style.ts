import styled, { media, css } from '@style/styled-components'

export const CharacterProfileContainer = styled.div`
	position: relative;
	display: flex;
	align-items: flex-end;

	${media.xs`
		padding-left: 0;
		flex-direction: column;
		align-items: center;
	`}
`

export const ProfileImgContainer = styled.div<{ noImage?: boolean }>`
	${media.xs`
		min-height: 35rem;
		width: 100%;
		padding: 0 1.5rem;
		box-sizing: border-box;
	`}

	& > button {
		position: relative;
		overflow: hidden;
		width: 23rem;
		margin-right: -3rem;
		transition: all 0.5s;
		height: 0;
		padding-bottom: 189%;

		${media.md`
			width: 20rem;
		`}

		${media.xs`
			margin: 0;
			width: 100%;
			filter: brightness(0.75);
			padding-bottom: 163%;
		`}

		${props =>
			props.noImage &&
			css`
				margin: 0;
				width: 0;
			`}

		& img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
`

export const ProfileImgModal = styled.button`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	${media.xs`
		width: 100%;
	`}

	& img {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}
`

export const GeneralInfo = styled.div<{ noImage?: boolean }>`
	flex: 1;
	overflow: hidden;
	margin-bottom: 2.5rem;

	${media.xs`
		width: 100%;
		margin: 0;
		margin-top: -35rem;
		position: relative;
		z-index: 1;
	`}

	${props =>
		props.noImage &&
		css`
			& ${NameInfo} {
				margin-left: 2rem;
			}

			& ${DetailsContainer} {
				padding: 2rem;
			}
		`}
`

export const NameInfo = styled.div`
	color: ${props => props.theme.palette.textPrimary};
	margin-left: 5rem;
	margin-bottom: 1rem;
	text-shadow: 0 0.2rem 1rem ${props => props.theme.palette.blackGlass};

	${media.xs`
		margin-left: 1.5rem;
	`}
`

export const DetailsContainer = styled.div`
	padding: 2rem;
	padding-left: 5rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 1rem;

	${media.xs`
		padding: 1.5rem;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
	`}

	& img {
		height: 1.8em;
		margin-right: 0.3em;
		vertical-align: middle;
	}
`

export const ArenaContainer = styled.div`
	display: flex;
	justify-content: flex-end;

	${media.xs`
		justify-content: flex-start;
	`}
`
