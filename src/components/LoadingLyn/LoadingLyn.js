import SpriteAnimator from 'react-sprite-animator'
import loadingImg from './images/loading.png'
import React from 'react'


import './styles/loading.scss'

const LoadingLyn = () => {
    return (
        <div className="loadingContainer">
            <SpriteAnimator
                className="loadingSprite"
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
