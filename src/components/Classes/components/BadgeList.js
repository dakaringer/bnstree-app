import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import BadgeListItem from './BadgeListItem'

import {sortedDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        badges: sortedDataSelector(state)
    }
}

const BadgeList = props => {
    const {t, badges} = props

    let soul = []
    badges.get('soul', Map()).forEach((badge, id) => {
        soul.push(<BadgeListItem badge={badge} badgeId={id} key={id} />)
    })

    let mystic = []
    badges.get('mystic', Map()).forEach((badge, id) => {
        mystic.push(<BadgeListItem badge={badge} badgeId={id} key={id} />)
    })

    return (
        <div className="badge-list-container">
            <h2>
                {t('mysticBadge')}
            </h2>
            <div className="badge-list badge-list-mystic">
                {mystic}
            </div>
            <h2>
                {t('soulBadge')}
            </h2>
            <div className="badge-list badge-list-soul">
                {soul}
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate(['skills', 'tooltip'])(BadgeList))
