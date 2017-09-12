import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {updateRegion, setData} from '../actions'
import {regionSelector} from '../selectors'

import icon from '../images/GameUI_HeaderIcon_210.png'

import {Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        region: regionSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: value => dispatch(updateRegion(value)),
        reset: () => dispatch(setData({}))
    }
}

const MarketHeader = props => {
    const {t, region, setRegion, reset} = props

    return (
        <div className="market-header section-header">
            <div className="header-title" onClick={() => reset()}>
                <img alt="market" src={icon} />
                {t('market')}
            </div>
            <div className="header-right">
                <RadioGroup
                    className="regionSelector"
                    size="small"
                    value={region}
                    onChange={e => setRegion(e.target.value)}>
                    <RadioButton value="na">NA</RadioButton>
                    <RadioButton value="eu">EU</RadioButton>
                </RadioGroup>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(MarketHeader))
