import * as React from 'react'
import SpriteAnimator from 'react-sprite-animator'

import * as style from './styles/index.css'
import loadingImg from './images/loading.png'

const LoadingLyn = () => {
	return (
		<div className={style.loadingContainer}>
			<SpriteAnimator
				sprite={loadingImg}
				width={150}
				height={64}
				shouldAnimate={true}
				direction="vertical"
				fps={30}
			/>
		</div>
	)
}

export default LoadingLyn