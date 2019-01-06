import * as React from 'react'
import FadeContainer from '@src/components/FadeContainer'
import ImageLoader from '@src/components/ImageLoader'

import * as style from './styles/index.css'

const images = require.context('./images', true, /\.jpe?g$/)
const keys = images.keys()
const imageArray = keys.map(key => images(key))

interface Props {}

interface State {
	i: number
}

interface Background {
	intervalId: number
}

class Background extends React.PureComponent<Props, State> {
	state: State = {
		i: Math.floor(Math.random() * imageArray.length)
	}

	componentDidMount = () => {
		this.intervalId = window.setInterval(this.next, 60000)
	}

	componentWillUnmount = () => {
		window.clearInterval(this.intervalId)
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
			<div className={style.background}>
				<FadeContainer currentKey={i} timeout={2000} className={style.imgContainer}>
					<ImageLoader key={i} src={imageArray[i]} />
				</FadeContainer>
				<div className={style.cover} />
			</div>
		)
	}
}

export default Background
