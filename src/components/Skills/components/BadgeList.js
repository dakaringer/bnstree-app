import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'
import {Fade} from 'react-reveal'

import BadgeListItem from './BadgeListItem'

import {sortedBadgeDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        badges: sortedBadgeDataSelector(state)
    }
}

const BadgeList = props => {
    const {t, badges} = props

    let soul = []
    badges.get('soul', Map()).forEach((badge, id) => {
        soul.push(<BadgeListItem badge={badge} itemId={id} key={id} />)
    })

    let mystic = []
    badges.get('mystic', Map()).forEach((badge, id) => {
        mystic.push(<BadgeListItem badge={badge} itemId={id} key={id} />)
    })

    return (
        <Fade className="item-list-container">
            <h2>{t('mysticBadge')}</h2>
            <div className="item-list badge-list-mystic">{mystic}</div>
            <h2>{t('soulBadge')}</h2>
            <div className="item-list badge-list-soul">{soul}</div>
        </Fade>
    )
}

export default connect(mapStateToProps)(translate(['classes', 'tooltip'])(BadgeList))
