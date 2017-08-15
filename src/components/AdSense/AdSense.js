import React from 'react'

export default class GoogleAd extends React.Component {
    componentDidMount() {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
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
                    style={{
                        display: 'block'
                    }}
                    data-ad-client={this.props.client}
                    data-ad-slot={this.props.slot}
                    data-ad-format={this.props.format}
                />
            </div>
        )
    }
}
