import * as React from 'react'
import * as classNames from 'classnames'

import * as style from './styles/index.css'
import * as blankImg from './images/blank.gif'

interface Props {
	src: string
	className?: string
	placeholder?: any
	onFail?: () => void
}

interface State {
	loaded: boolean
	noImage: boolean
}

interface ImageLoader {
	imgRef: React.RefObject<HTMLImageElement>
}

class ImageLoader extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)

		this.imgRef = React.createRef()
		this.state = {
			loaded: false,
			noImage: false
		}
	}

	componentDidMount() {
		if (this.imgRef.current) this.imgRef.current.onload = this.onLoad
	}

	componentWillUnmount() {
		if (this.imgRef.current) this.imgRef.current.onload = null
	}

	onLoad = () => {
		this.setState({
			loaded: true
		})
	}

	onError = (error: React.SyntheticEvent<HTMLImageElement>) => {
		const { placeholder, onFail } = this.props
		error.currentTarget.src = placeholder || blankImg
		this.setState({
			noImage: true
		})
		if (onFail) onFail()
	}

	render() {
		const { src, className } = this.props
		const { loaded } = this.state
		return (
			<img
				ref={this.imgRef}
				src={src}
				onError={this.onError}
				className={classNames(style.fadeImage, { [style.loaded]: loaded }, className)}
			/>
		)
	}
}

export default ImageLoader
