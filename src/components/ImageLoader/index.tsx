import * as React from 'react'

import { ImageContainer } from './style'
import blankImg from './images/blank.gif'

interface Props {
	src: string
	className?: string
	placeholder?: React.ReactNode
	onLoad?: () => void
	onError?: () => void
}

interface State {
	loaded: boolean
	noImage: boolean
}

class ImageLoader extends React.PureComponent<Props, State> {
	state: State = {
		loaded: false,
		noImage: false
	}

	onLoad = () => {
		const { onLoad } = this.props
		const { noImage } = this.state
		this.setState({
			loaded: true
		})
		if (onLoad && !noImage) {
			onLoad()
		}
	}

	onError = (error: React.SyntheticEvent<HTMLImageElement>) => {
		const { placeholder, onError } = this.props
		error.currentTarget.src = placeholder || blankImg
		this.setState({
			noImage: true
		})
		if (onError) {
			onError()
		}
	}

	render = () => {
		const { src, className } = this.props
		const { loaded } = this.state
		return (
			<ImageContainer
				loaded={loaded}
				src={src}
				onLoad={this.onLoad}
				onError={this.onError}
				className={className}
			/>
		)
	}
}

export default ImageLoader
