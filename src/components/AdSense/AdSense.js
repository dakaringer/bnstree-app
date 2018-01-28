import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'

import { userSelector } from '../../selectors'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

class GoogleAdUnit extends React.PureComponent {
    componentDidMount() {
        try {
            ; (window.adsbygoogle = window.adsbygoogle || []).push({})
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
            <div style={this.props.wrapperDivStyle} className="adBlock">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', textAlign: 'center', ...this.props.style }}
                    {...this.props}
                />
            </div>
        )
    }
}

const GoogleAd = props => {
    const { user, dispatch, ...ad } = props

    if (user && user.getIn(['role', 'adminLevel'], 0) > 4) {
        return null
    }

    return (
        <Delay wait={1000}>
            <GoogleAdUnit {...ad} />
        </Delay>
    )
}

export default connect(mapStateToProps)(GoogleAd)
