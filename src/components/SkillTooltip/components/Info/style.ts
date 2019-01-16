import styled from '@style/styled-components'

import ImageLoader from '@components/ImageLoader'
import ModText from '@components/ModText'

export const InfoContainer = styled.div`
	display: flex;
`

export const InfoItem = styled.div`
	width: 25%;
	margin-right: 0.6rem;

	&:last-child {
		margin: 0;
	}
`

export const InfoItemHeader = styled.div`
	text-align: center;
	margin-bottom: 0.5rem;
	border-radius: 0.3rem;
	padding: 0.2rem;
	background-color: rgba(0, 0, 0, 0.9);
`

export const InfoItemData = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	height: 6rem;
	padding: 0.5rem;
	border-radius: 0.3rem;
	background-color: rgba(0, 0, 0, 0.9);
`

export const AreaContainer = styled(ModText)`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	& > span {
		position: relative;
		z-index: 1;
	}
`

export const AreaImage = styled(ImageLoader)`
	position: absolute;
	z-index: 0;
	height: 100%;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
`
