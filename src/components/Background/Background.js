import React from 'react'
import {Carousel} from 'antd'

import './styles/Background.scss'

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

class Background extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            backgrounds: [],
            bgTranslate: 0
        }
    }

    componentWillMount() {
        let backgrounds = []
        for (let i = 1; i <= 12; i++) {
            backgrounds.push(
                <span key={`bg${i}`}>
                    <img
                        src={`https://static.bnstree.com/images/backgrounds/${i}.jpg`}
                        alt="background"
                    />
                </span>
            )
        }
        this.setState({backgrounds: shuffle(backgrounds)})

        window.addEventListener('scroll', e => this.handleScroll(e, this))
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', e => this.handleScroll(e, this))
    }

    handleScroll(event, t) {
        if (window.innerWidth > 767) {
            let scrollTop = event.srcElement.body.scrollTop
            requestAnimationFrame(() => {
                t.setState({
                    bgTranslate: scrollTop / 5
                })
            })
        }
    }

    render() {
        let transform = {
            transform: `translate(0px, -${this.state.bgTranslate}px)`
        }

        return (
            <div className="background" style={transform}>
                <Carousel
                    effect="fade"
                    dots={false}
                    autoplay={true}
                    autoplaySpeed="60000"
                    draggable={false}
                    touchMove={false}
                    pauseOnHover={false}
                    infinite={true}>
                    {this.state.backgrounds}
                </Carousel>
                <div className="cover" />
            </div>
        )
    }
}

export default Background
