import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Collapse} from 'antd'

import {characterSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        statData: characterSelector(state).get('statData')
    }
}

const CharacterStatItem = props => {
    const {t, statData, stats, type} = props

    let list = []

    stats.forEach((stat, i) => {
        let subValues = []
        if (stat[0] !== `${type}_stiff_duration_level`) {
            if (stat[0] !== 'int_hp_regen') {
                subValues.push(
                    <div key="base">
                        <span className="subHeader">{t('base')}</span>
                        <span className="subValue">
                            {statData.getIn(['base_ability', stat[0]], 0)}
                        </span>
                    </div>,
                    <div key="equip">
                        <span className="subHeader">{t('equip')}</span>
                        <span className="subValue">
                            {statData.getIn(['equipped_ability', stat[0]], 0)}
                        </span>
                    </div>
                )
            }
            stat[1].forEach(extra => {
                subValues.push(
                    <div key={extra}>
                        <span className="subHeader">{t(extra)}</span>
                        <span className="subValue">
                            {statData.getIn(['total_ability', extra], 0)}
                            {extra.endsWith('rate') ? '%' : ''}
                        </span>
                    </div>
                )
            })
        } else {
            subValues.push(
                <div key="duration">
                    <span className="subHeader">{t(`${type}_stiff_duration_rate`)}</span>
                    <span className="subValue">
                        {statData.getIn(['total_ability', stat[0]], 0) * 20}%
                    </span>
                </div>
            )
        }

        let header = (
            <span>
                {t(stat[0])}
                <span className="mainValue">
                    {stat[0] === `${type}_stiff_duration_level`
                        ? `${t('level', {level: statData.getIn(['total_ability', stat[0]], 0)})} `
                        : ''}
                    {stat[0] !== `${type}_stiff_duration_level`
                        ? statData.getIn(['total_ability', stat[0]], 0)
                        : ''}
                </span>
            </span>
        )

        list.push(
            <Collapse.Panel header={header} className="statItem" bordered={false} key={i}>
                <div>{subValues}</div>
            </Collapse.Panel>
        )
    })

    return (
        <Collapse className="subStats" bordered={false}>
            {list}
        </Collapse>
    )
}

export default connect(mapStateToProps)(translate('character')(CharacterStatItem))
