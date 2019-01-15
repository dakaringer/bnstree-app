import * as React from 'react'

import ImageLoader from '@components/ImageLoader'

import { BackgroundContainer, ImageFadeContainer, Backdrop } from './style'

const images = require.context('./images', true, /\.jpe?g$/)
const keys = images.keys()
const imageArray = keys.map(key => images(key))

interface State {
	i: number
}

interface Background {
	intervalId: NodeJS.Timeout
}

class Background extends React.PureComponent<{}, State> {
	state: State = {
		i: Math.floor(Math.random() * imageArray.length)
	}

	componentDidMount = () => {
		this.intervalId = setInterval(this.next, 60000)
	}

	componentWillUnmount = () => {
		clearInterval(this.intervalId)
	}

	next = () => {
		const { i } = this.state

		let next = i + 1
		if (next === imageArray.length) {
			next = 0
		}

		this.setState({
			i: next
		})
	}

	render = () => {
		const { i } = this.state

		return (
			<BackgroundContainer>
				<ImageFadeContainer currentKey={i} timeout={2000}>
					<ImageLoader key={i} src={imageArray[i]} />
				</ImageFadeContainer>
				<Backdrop />
			</BackgroundContainer>
		)
	}
}

export default Background
