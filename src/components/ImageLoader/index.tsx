import * as React from 'react'
import * as classNames from 'classnames'

import * as style from './styles/index.css'
import * as blankImg from './images/blank.gif'

interface Props {
	src: string
	className?: string
	placeholder?: any
	onLoad?: () => void
	onError?: () => void
}

interface State {
	loaded: boolean
	noImage: boolean
}

class ImageLoader extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			loaded: false,
			noImage: false
		}
	}

	onLoad = () => {
		const { onLoad } = this.props
		const { noImage } = this.state
		this.setState({
			loaded: true
		})
		if (onLoad && !noImage) onLoad()
	}

	onError = (error: React.SyntheticEvent<HTMLImageElement>) => {
		const { placeholder, onError } = this.props
		error.currentTarget.src = placeholder || blankImg
		this.setState({
			noImage: true
		})
		if (onError) onError()
	}

	render() {
		const { src, className } = this.props
		const { loaded } = this.state
		return (
			<img
				src={src}
				onLoad={this.onLoad}
				onError={this.onError}
				className={classNames(style.fadeImage, { [style.loaded]: loaded }, className)}
			/>
		)
	}
}

export default ImageLoader
