import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Link} from 'react-router-dom'

import {updateRegion} from '../actions'
import {viewSelector} from '../../../selectors'

import icon from '../images/GameUI_HeaderIcon_210.png'

import {Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        region: viewSelector(state).get('marketRegion', 'na')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: value => dispatch(updateRegion(value))
    }
}

const MarketHeader = props => {
    const {t, region, setRegion} = props

    return (
        <div className="market-header section-header">
            <Link className="header-title" to="/market">
                <img alt="market" src={icon} />
                {t('market')}
            </Link>
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
