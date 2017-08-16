import React from 'react'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import './styles/Stream.scss'

import Header from './components/StreamHeader'
import StreamList from './components/StreamList'

const Streams = props => {
    const {t} = props
    return (
        <div className="stream">
            <Helmet>
                <title>{`${t('news')} | BnSTree`}</title>
            </Helmet>
            <div className="container">
                <Header />
                <div className="stream-container">
                    <StreamList />
                </div>
            </div>
        </div>
    )
}

export default translate('general')(Streams)
