import React from 'react'

import './styles/Background.scss'

class Background extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            bgTranslate: 0,
            i: 1
        }
    }

    componentWillMount() {
        window.addEventListener('scroll', e => this.handleScroll(e, this))
        this.setState({i: Math.floor(Math.random() * 12 + 1)})
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
                <img
                    src={`https://static.bnstree.com/images/backgrounds/${this.state.i}.jpg`}
                    alt="background"
                />
                <div className="cover" />
            </div>
        )
    }
}

export default Background
