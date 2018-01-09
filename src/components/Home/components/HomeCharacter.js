import React from 'react'
import ReactDOM from 'react-dom'
import {Fade} from 'react-reveal'

import overlayImages from '../images/map_overlayImg'

const appRoot = document.getElementById('app-root')

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class HomeCharacter extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            set: {},
            hidden: null
        }
        this.el = document.createElement('div')
    }

    componentWillMount() {
        let max = overlayImages.length - 1
        let setNumber = getRandomInt(0, max)
        let set = overlayImages[setNumber]

        let hidden = null
        if (set.left && set.right) {
            hidden = getRandomInt(0, 2)
        }

        this.setState({
            set: set,
            hidden: hidden
        })
    }

    componentDidMount() {
        appRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        appRoot.removeChild(this.el)
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

        return ReactDOM.createPortal(
            <Fade className="home-character">
                {left}
                {center}
                {right}
            </Fade>,
            this.el
        )
    }
}

export default HomeCharacter
