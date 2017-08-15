import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import SoulshieldListItem from './SoulshieldListItem'

import {sortedSoulshieldDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        soulshields: sortedSoulshieldDataSelector(state)
    }
}

const SoulshieldList = props => {
    const {t, soulshields} = props

    let dungeons = []
    soulshields.get('PvE', Map()).forEach((set, id) => {
        dungeons.push(<SoulshieldListItem set={set} itemId={id} key={id} />)
    })

    let battlegrounds = []
    soulshields.get('6v6', Map()).forEach((set, id) => {
        battlegrounds.push(<SoulshieldListItem set={set} itemId={id} key={id} />)
    })

    return (
        <div className="item-list-container">
            <h2>
                {t('PvE')}
            </h2>
            <div className="item-list soulshield-list-pve">
                {dungeons}
            </div>
            <h2>
                {t('6v6')}
            </h2>
            <div className="item-list soulshield-list-pvp">
                {battlegrounds}
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate(['skills', 'tooltip'])(SoulshieldList))
