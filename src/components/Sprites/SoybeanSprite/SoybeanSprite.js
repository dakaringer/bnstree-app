import React from 'react'
import SpriteAnimator from 'react-sprite-animator'
import soybean from './images/CreditImage_Character.png'

import './styles/sprite.scss'

const SoybeanSprite = () => {
    return (
        <div className="sprite-container">
            <SpriteAnimator
                className="soybeanSprite"
                sprite={soybean}
                scale={2}
                width={245}
                height={374}
                shouldAnimate={true}
                direction="horizontal"
                fps={7}
                wrapAfter={2}
                frameCount={10}
            />
        </div>
    )
}

export default SoybeanSprite
