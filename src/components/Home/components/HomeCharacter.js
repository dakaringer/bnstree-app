import React from 'react'
import {Fade} from 'react-reveal'

import overlayImages from '../images/map_overlayImg'

class HomeCharacter extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            set: {},
            hidden: null
        }
    }

    componentWillMount() {
        let max = Object.keys(overlayImages).length
        let setNumber = Math.floor(Math.random() * max) + 1
        let set = overlayImages[`set_${setNumber}`]

        let hidden = null
        if (set.left && set.right) {
            hidden = Math.floor(Math.random() * 2) + 1
        }

        this.setState({
            set: set,
            hidden: hidden
        })
    }

    render() {
        let {set, hidden} = this.state

        let left = set.left ? (
            <img
                className={`character-left ${hidden && hidden === 1 ? 'hidden' : ''}`}
                alt="character"
                src={set.left}
                style={set.leftStyle}
            />
        ) : null
        let right = set.right ? (
            <img
                className={`character-right ${hidden && hidden === 2 ? 'hidden' : ''}`}
                alt="character"
                src={set.right}
                style={set.rightStyle}
            />
        ) : null
        let center = set.center ? (
            <img
                className="character-center"
                alt="character"
                src={set.center}
                style={set.centerStyle}
            />
        ) : null

        return (
            <Fade className="home-character">
                {left}
                {center}
                {right}
            </Fade>
        )
    }
}

export default HomeCharacter
