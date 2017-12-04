import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'

import TranslatorSelectorItem from './TranslatorSelectorItem'

import {referenceDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        referenceData: referenceDataSelector(state)
    }
}

const classes = List([
    'BLADE_MASTER',
    'KUNG_FU_MASTER',
    'DESTROYER',
    'FORCE_MASTER',
    'ASSASSIN',
    'SUMMONER',
    'BLADE_DANCER',
    'WARLOCK',
    'SOUL_FIGHTER',
    'GUNSLINGER'
])

const items = List(['BADGE_SOUL', 'BADGE_MYSTIC', 'SOULSHIELD'])

const names = Map({
    skillNames: classes.map(group => Map({_id: group})),
    itemNames: items.map(group => Map({_id: group}))
})

const TranslatorSelector = props => {
    let {referenceData} = props

    return (
        <div className="translator-selector">
            <div className="translator-selector-group">
                <h4>UI</h4>
                <TranslatorSelectorItem items={referenceData} />
            </div>
            <div className="translator-selector-group">
                <h4>Names</h4>
                <TranslatorSelectorItem items={names} names />
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(TranslatorSelector)
