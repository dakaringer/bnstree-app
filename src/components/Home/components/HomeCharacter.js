import React from 'react'

import overlayImages from '../images/map_overlayImg'

const min = 1
const max = 4

const HomeCharacter = () => {
    let setNumber = Math.floor(Math.random() * (max - min + 1)) + min
    let set = overlayImages[`set_${setNumber}`]

    let left = set.left
        ? <img className="character-left" alt="character1" src={set.left} style={set.leftStyle} />
        : null
    let right = set.right
        ? <img
              className="character-right"
              alt="character1"
              src={set.right}
              style={set.rightStyle}
          />
        : null

    return (
        <div className="home-character">
            {left}
            {right}
        </div>
    )
}

export default HomeCharacter
