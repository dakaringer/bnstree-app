import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Tooltip} from 'antd'

import {characterSelector} from '../selectors'

import CharacterStatList from './CharacterStatList'
import CharacterPointMenu from './CharacterPointMenu'

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

const CharacterStats = props => {
    let {t, classCode, statData, attack} = props

    let stats = null
    let point = 0
    let pointMenu = null
    if (attack) {
        let a = attackStats.filter(stat => {
            return (
                !stat[0].startsWith('attack_attribute') ||
                (classElements[classCode][0] === stat[0] || classElements[classCode][1] === stat[0])
            )
        })

        stats = <CharacterStatList stats={a} type="attack" />

        point = statData.getIn(['point_ability', 'offense_point'], 0)
        pointMenu = <CharacterPointMenu points={point} type="attack" />
    } else {
        stats = <CharacterStatList stats={defenseStats} type="defend" />

        point = statData.getIn(['point_ability', 'defense_point'], 0)
        pointMenu = <CharacterPointMenu points={point} type="defense" />
    }

    return (
        <div className={`character-stats ${attack ? 'attack' : 'defense'}`}>
            <div className="mainStat">
                <h4>{attack ? t('attack_power_value') : t('max_hp')}</h4>
                <h3 className="mainValue">
                    {attack
                        ? statData.getIn(['total_ability', 'attack_power_value'], 0)
                        : statData.getIn(['total_ability', 'max_hp'], 0)}
                </h3>
                <hr />
                <Tooltip
                    placement="bottom"
                    title={pointMenu}
                    trigger="click"
                    overlayClassName="hmPointMenu">
                    <p>
                        {attack ? t('attackPoints') : t('defensePoints')} {point}P
                    </p>
                </Tooltip>
            </div>
            <div className="subStatsContainer">{stats}</div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('character')(CharacterStats))
