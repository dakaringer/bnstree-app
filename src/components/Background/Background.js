import React from 'react'


import './styles/Background.scss'

const MAX_BG = 52

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
        this.setState({ i: Math.floor(Math.random() * MAX_BG + 1) })
        //this.setState({ i: MAX_BG })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', e => this.handleScroll(e, this))
    }

    handleScroll(event, t) {
        if (window.innerWidth > 767) {
            let target = event.target || event.srcElement
            let scrollTop = target.body.scrollTop
            requestAnimationFrame(() => {
                t.setState({
                    bgTranslate: scrollTop / 5
                })
            })
        }
    }

    render() {
        let transform = {
            transform: `translate3d(0px, -${this.state.bgTranslate}px, 0)`
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
