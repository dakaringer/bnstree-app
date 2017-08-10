import React, {Component} from 'react'
import {translate} from 'react-i18next'

import './styles/Stream.scss'

import Header from './components/StreamHeader'
import StreamList from './components/StreamList'

class Streams extends Component {
    componentDidMount() {
        const {t} = this.props
        document.title = `${t('streams')} | BnSTree`
    }

    render() {
        return (
            <div className="stream">
                <div className="container">
                    <Header />
                    <div className="stream-container">
                        <StreamList />
                    </div>
                </div>
            </div>
        )
    }
}

export default translate('general')(Streams)
