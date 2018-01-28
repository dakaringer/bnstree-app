import React from 'react'
import ReactDOM from 'react-dom'
import Fade from 'react-reveal/Fade'

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
            hidden: null,
            show: false
        }
        this.el = document.createElement('div')
    }

    componentWillMount() {
        let max = overlayImages.length - 1
        let setNumber = getRandomInt(0, max)
        let set = overlayImages[setNumber]

        let hidden = null
        if (set.left && set.right) {
            hidden = getRandomInt(0, 1)
        }

        this.setState({
            set: set,
            hidden: hidden
        })
    }

    componentDidMount() {
        appRoot.appendChild(this.el)

        this.timeout = window.setTimeout(
            () => this.setState({ show: true }), 500
        )
    }

    componentWillUnmount() {
        appRoot.removeChild(this.el)

        if (this.timeout)
            this.timeout = window.clearTimeout(this.timeout)
    }

    render() {
        let { set, hidden } = this.state

        let left = set.left ? (
            <img
                className={`character-left ${hidden && hidden === 0 ? 'hidden' : ''}`}
                alt="character"
                src={set.left}
                style={set.leftStyle}
            />
        ) : null
        let right = set.right ? (
            <img
                className={`character-right ${hidden && hidden === 1 ? 'hidden' : ''}`}
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
            <Fade duration={2000} when={this.state.show}>
                <div className="home-character">
                    {left}
                    {center}
                    {right}
                </div>
            </Fade>,
            this.el
        )
    }
}

export default HomeCharacter
