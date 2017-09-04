import React from 'react'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import './styles/Stream.scss'

import AdSense from '../AdSense/AdSense'
import Header from './components/StreamHeader'
import StreamList from './components/StreamList'

const Streams = props => {
    const {t} = props
    return (
        <div className="stream">
            <Helmet>
                <title>{`${t('news')} | BnSTree`}</title>
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
        </div>
    )
}

export default translate('general')(Streams)
