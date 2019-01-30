import React, { useState } from 'react'

import { ImageContainer } from './style'
import blankImg from './images/blank.gif'

interface Props {
	src: string
	className?: string
	placeholder?: React.ReactNode
	onLoad?: () => void
	onError?: () => void
}

const ImageLoader: React.FC<Props> = props => {
	const [loaded, setLoaded] = useState(false)
	const [noImage, setNoImage] = useState(false)

	const handleLoad = () => {
		const { onLoad } = props
		setLoaded(true)
		if (onLoad && !noImage) {
			onLoad()
		}
	}

	const handleError = (error: React.SyntheticEvent<HTMLImageElement>) => {
		const { placeholder, onError } = props
		error.currentTarget.src = placeholder || blankImg
		setNoImage(true)
		if (onError) {
			onError()
		}
	}

	const { src, className } = props
	return <ImageContainer loaded={loaded} src={src} onLoad={handleLoad} onError={handleError} className={className} />
}

export default ImageLoader
