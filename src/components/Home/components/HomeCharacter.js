import React, {Component} from 'react'

import left from '../images/overlay_1_left.png'
import right from '../images/overlay_1_right.png'

class HomeCharacter extends Component {
    render() {
        return (
            <div className="home-character">
                <img className="character-left" alt="character1" src={left} />
                <img className="character-right" alt="character2" src={right} />
            </div>
        )
    }
}

export default HomeCharacter
