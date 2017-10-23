import React from 'react'
import Delay from 'react-delay'
import {Fade} from 'react-reveal'

class GoogleAdUnit extends React.PureComponent {
    componentDidMount() {
        try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
            console.error(error)
        }
    }

    componentWillUnmount() {
        // IMPORTANT! Allow us to push new slot on other pages
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.length = 0
    }

    render() {
        return (
            <Fade style={this.props.wrapperDivStyle} className="adBlock">
                <ins
                    className="adsbygoogle"
                    style={{display: 'block', textAlign: 'center', ...this.props.style}}
                    {...this.props}
                />
            </Fade>
        )
    }
}

const GoogleAd = props => {
    return (
        <Delay wait={1000}>
            <GoogleAdUnit {...props} />
        </Delay>
    )
}

export default GoogleAd
