import React, {PureComponent} from 'react'
import Delay from 'react-delay'

class GoogleAdUnit extends PureComponent {
    componentDidMount() {
        try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
            console.log(error)
        }
    }

    componentWillUnmount() {
        // IMPORTANT! Allow us to push new slot on other pages
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.length = 0
    }

    render() {
        return (
            <div style={this.props.wrapperDivStyle} className="adBlock">
                <ins
                    className="adsbygoogle"
                    style={{display: 'block', textAlign: 'center'}}
                    {...this.props}
                />
            </div>
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
