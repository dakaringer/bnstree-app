import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Tooltip } from 'antd'

import { characterSelector } from '../selectors'

import CharacterStatList from './CharacterStatList'
import CharacterPointMenu from './CharacterPointMenu'

import hmPointImages from '../images/map_hmPointImg'

const mapStateToProps = state => {
    return {
        statData: characterSelector(state).get('statData'),
        classCode: characterSelector(state).getIn(['general', 'classCode'])
    }
}

const attackStats = [
    ['attack_power_value', []],
    ['pc_attack_power_value', []],
    ['boss_attack_power_value', []],
    ['attack_pierce_value', ['attack_defend_pierce_rate', 'attack_parry_pierce_rate']],
    ['attack_hit_value', ['attack_hit_rate']],
    [
        'attack_concentrate_value',
        ['attack_perfect_parry_damage_rate', 'attack_counter_pierce_rate']
    ],
    ['attack_critical_value', ['attack_critical_rate']],
    ['attack_critical_damage_value', ['attack_critical_damage_rate']],
    ['attack_stiff_duration_level', []],
    ['attack_damage_modify_diff', ['attack_damage_modify_rate']],
    ['hate_power_value', ['hate_power_rate']],
    ['attack_attribute_fire_value', ['attack_attribute_fire_rate']],
    ['attack_attribute_ice_value', ['attack_attribute_ice_rate']],
    ['attack_attribute_wind_value', ['attack_attribute_wind_rate']],
    ['attack_attribute_earth_value', ['attack_attribute_earth_rate']],
    ['attack_attribute_lightning_value', ['attack_attribute_lightning_rate']],
    ['attack_attribute_void_value', ['attack_attribute_void_rate']],
    ['abnormal_attack_power_value', ['abnormal_attack_power_rate']]
]

const defenseStats = [
    ['max_hp', []],
    [
        'defend_power_value',
        [
            'defend_physical_damage_reduce_rate',
            'aoe_defend_power_value',
            'aoe_defend_damage_reduce_rate'
        ]
    ],
    [
        'pc_defend_power_value',
        ['pc_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate']
    ],
    [
        'boss_defend_power_value',
        ['boss_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate']
    ],
    ['defend_dodge_value', ['defend_dodge_rate', 'counter_damage_reduce_rate']],
    [
        'defend_parry_value',
        ['defend_parry_rate', 'defend_parry_reduce_rate', 'perfect_parry_damage_reduce_rate']
    ],
    ['defend_critical_value', ['defend_critical_rate', 'defend_critical_damage_rate']],
    ['defend_stiff_duration_level', []],
    ['defend_damage_modify_diff', ['defend_damage_modify_rate']],
    ['int_hp_regen', ['hp_regen', 'hp_regen_combat']],
    ['heal_power_value', ['heal_power_diff', 'heal_power_rate']],
    ['abnormal_defend_power_value', ['abnormal_defend_power_rate']]
]

const classElements = {
    BM: ['attack_attribute_fire_value', 'attack_attribute_lightning_value'],
    KF: ['attack_attribute_fire_value', 'attack_attribute_wind_value'],
    DE: ['attack_attribute_earth_value', 'attack_attribute_void_value'],
    FM: ['attack_attribute_fire_value', 'attack_attribute_ice_value'],
    AS: ['attack_attribute_lightning_value', 'attack_attribute_void_value'],
    SU: ['attack_attribute_wind_value', 'attack_attribute_earth_value'],
    BD: ['attack_attribute_wind_value', 'attack_attribute_lightning_value'],
    WL: ['attack_attribute_ice_value', 'attack_attribute_void_value'],
    SF: ['attack_attribute_ice_value', 'attack_attribute_earth_value'],
    SH: ['attack_attribute_fire_value', 'attack_attribute_void_value']
}

const hmPointAttackExtra = [['threat', 0], ['energy', 3]]
const hmPointDefenseExtra = [['regen', 1], ['speed', 2], ['status', 4]]

const CharacterStats = props => {
    let { t, classCode, statData, type } = props

    let stats = null
    let hmPoint = 0
    let hmPointMenu = null
    let hmPointExtra = []
    let extraEffects = []

    if (type === 'attack') {
        let a = attackStats.filter(stat => {
            return (
                !stat[0].startsWith('attack_attribute') ||
                (classElements[classCode][0] === stat[0] || classElements[classCode][1] === stat[0])
            )
        })

        stats = <CharacterStatList stats={a} type="attack" />
        hmPoint = statData.getIn(['point_ability', 'offense_point'], 0)

        hmPointAttackExtra.forEach(e => {
            let [t, i] = e
            let p = statData.getIn(['point_ability', 'picks', i, 'point'], 0)

            if (p !== 0) {
                extraEffects.push(t)
            }

            hmPointExtra.push(
                <div className={`hmPoint-item ${p === 0 ? 'disabled' : ''}`} key={t}>
                    <img src={hmPointImages[t]} alt={`hmPoint-${t}`} />
                    {p}P
                </div>
            )
        })

        hmPointMenu = <CharacterPointMenu points={hmPoint} extraEffects={extraEffects} type="attack" />
    } else {
        stats = <CharacterStatList stats={defenseStats} type="defend" />
        hmPoint = statData.getIn(['point_ability', 'defense_point'], 0)

        hmPointDefenseExtra.forEach(e => {
            let [t, i] = e
            let p = statData.getIn(['point_ability', 'picks', i, 'point'], 0)

            if (p !== 0) {
                extraEffects.push(t)
            }

            hmPointExtra.push(
                <div className={`hmPoint-item ${p === 0 ? 'disabled' : ''}`} key={t}>
                    <img src={hmPointImages[t]} alt={`hmPoint-${t}`} />
                    {p}P
                </div>
            )
        })

        hmPointMenu = <CharacterPointMenu points={hmPoint} extraEffects={extraEffects} type="defense" />
    }

    return (
        <div className={`character-stats ${type}`}>
            <div className="mainStat">
                <h4>{type === 'attack' ? t('attack_power_value') : t('max_hp')}</h4>
                <h3 className="mainValue">
                    {type === 'attack'
                        ? statData.getIn(['total_ability', 'attack_power_value'], 0)
                        : statData.getIn(['total_ability', 'max_hp'], 0)}
                </h3>
                <Tooltip
                    placement="bottom"
                    title={hmPointMenu}
                    trigger="click"
                    overlayClassName="hmPointMenu">
                    <div className="hmPoint">
                        <div className="hmPoint-main hmPoint-item">
                            <img src={hmPointImages[type]} alt='hmPoint-attack' />
                            {hmPoint}P
                        </div>
                        <div className="hmPoint-extra">
                            {hmPointExtra}
                        </div>
                    </div>
                </Tooltip>
            </div>
            <div className="subStatsContainer">{stats}</div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('character')(CharacterStats))
