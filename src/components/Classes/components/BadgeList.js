import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import BadgeListItem from './BadgeListItem'

import {combinedBadgeDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        badges: combinedBadgeDataSelector(state)
    }
}

const BadgeList = props => {
    const {badges} = props

    let list = []
    badges.forEach((badge, id) => {
        list.push(<BadgeListItem badge={badge} badgeId={id} key={id} />)
    })

    return (
        <div className="badge-list">
            {list}
        </div>
    )
}

export default connect(mapStateToProps)(translate('tooltip')(BadgeList))
