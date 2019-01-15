import * as React from 'react'
import SpriteAnimator from 'react-sprite-animator'

import { LoadingContainer } from './style'
import loadingImg from './images/loading.png'

const LoadingLyn = () => {
	return (
		<LoadingContainer>
			<SpriteAnimator sprite={loadingImg} width={150} height={64} shouldAnimate direction="vertical" fps={30} />
		</LoadingContainer>
	)
}

export default LoadingLyn
