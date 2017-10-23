import React from 'react'
import {Fade} from 'react-reveal'
import SpriteAnimator from 'react-sprite-animator'
import soybean from './images/CreditImage_Character.png'

import './styles/sprite.scss'

const SoybeanSprite = () => {
    return (
        <Fade className="sprite-container">
            <SpriteAnimator
                className="soybeanSprite"
                sprite={soybean}
                scale={3}
                width={245}
                height={374}
                shouldAnimate={true}
                direction="horizontal"
                fps={7}
                wrapAfter={2}
                frameCount={10}
            />
        </Fade>
    )
}

export default SoybeanSprite
