import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import BadgeListItem from './BadgeListItem'

import {namedBadgeDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        badges: namedBadgeDataSelector(state)
    }
}

const BadgeList = props => {
    const {badges} = props

    let list = []
    badges.forEach((badge, i) => {
        list.push(<BadgeListItem badge={badge} key={i} />)
    })

    return (
        <div className="badge-list">
            {list}
        </div>
    )
}

export default connect(mapStateToProps)(translate('tooltip')(BadgeList))
