import React from 'react'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'

import './styles/Stream.scss'

import AdSense from '../AdSense/AdSense'
import Header from './components/StreamHeader'
import StreamList from './components/StreamList'

class Streams extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        const {t} = this.props

        return (
            <Fade className="stream">
                <Helmet>
                    <title>{`${t('streams')} | BnSTree`}</title>
                    <meta name="description" content="Live streams of Blade & Soul on Twitch.tv!" />
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header />
                    <div className="stream-container">
                        <StreamList />
                        <AdSense
                            data-ad-client="ca-pub-2048637692232915"
                            data-ad-slot="2719129989"
                            data-ad-format="auto"
                        />
                    </div>
                </div>
            </Fade>
        )
    }
}

export default translate('general')(Streams)
