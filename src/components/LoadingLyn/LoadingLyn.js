import SpriteAnimator from 'react-sprite-animator'
import loadingImg from './images/loading.png'
import React from 'react'
import {Fade} from 'react-reveal'

import './styles/loading.scss'

const LoadingLyn = () => {
    return (
        <div className="loadingContainer">
            <Fade>
                <SpriteAnimator
                    className="loadingSprite"
                    sprite={loadingImg}
                    width={150}
                    height={64}
                    shouldAnimate={true}
                    direction="vertical"
                    fps={30}
                />
            </Fade>
        </div>
    )
}

export default LoadingLyn
