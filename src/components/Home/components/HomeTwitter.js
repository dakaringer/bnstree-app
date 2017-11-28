import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {listSelector} from '../selectors'

import HomeTwitterItem from './HomeTwitterItem'

const mapStateToProps = state => {
    return {
        list: listSelector(state)
    }
}

const HomeTwitter = props => {
    let {t, list} = props

    let tweets = []
    list.forEach(tweet => tweets.push(<HomeTwitterItem tweet={tweet} key={tweet.get('_id')} />))

    return (
        <div className="home-twitter-container">
            <h3>{t('twitter')}</h3>
            <div className="home-twitter">{tweets}</div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(HomeTwitter))
