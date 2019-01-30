import React, { useEffect, useState } from 'react'

import ImageLoader from '@components/ImageLoader'

import { BackgroundContainer, ImageFadeContainer, Backdrop } from './style'

const images = require.context('./images', true, /\.jpe?g$/)
const keys = images.keys()
const imageArray = keys.map(key => images(key))

const Background: React.FC = () => {
	const [i, setIndex] = useState(Math.floor(Math.random() * imageArray.length))

	useEffect(() => {
		const interval = setInterval(() => {
			let next = i + 1
			if (next === imageArray.length) {
				next = 0
			}

			setIndex(next)
		}, 60000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<BackgroundContainer>
			<ImageFadeContainer currentKey={i} timeout={2000}>
				<ImageLoader key={i} src={imageArray[i]} />
			</ImageFadeContainer>
			<Backdrop />
		</BackgroundContainer>
	)
}

export default Background
