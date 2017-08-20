import React from 'react'

export default class GoogleAd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({show: true})
        }, 1000)
    }

    componentDidUpdate() {
        if (this.state.show) {
            try {
                ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (error) {
                console.log(error)
            }
        }
    }

    componentWillUnmount() {
        // IMPORTANT! Allow us to push new slot on other pages
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.length = 0
    }

    render() {
        let ad = null

        if (this.state.show) {
            ad = (
                <ins
                    className="adsbygoogle"
                    style={{display: 'block', textAlign: 'center'}}
                    {...this.props}
                />
            )
        }

        return (
            <div style={this.props.wrapperDivStyle} className="adBlock">
                {ad}
            </div>
        )
    }
}
