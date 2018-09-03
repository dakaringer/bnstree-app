import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {Collapse, Tooltip} from 'antd'

import {
    uiTextSelector,
    characterSelector
} from '../selector'

import attackImg from '../images/hm_attack.png'
import healthImg from '../images/hm_health.png'
import defenseImg from '../images/hm_defense.png'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('CHARACTER_STATS', Map()),
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
    ['attack_concentrate_value', ['attack_perfect_parry_damage_rate', 'attack_counter_pierce_rate']],
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
    ['defend_power_value', ['defend_physical_damage_reduce_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate']],
    ['pc_defend_power_value', ['pc_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate']],
    ['boss_defend_power_value', ['boss_defend_power_rate', 'aoe_defend_power_value', 'aoe_defend_damage_reduce_rate']],
    ['defend_dodge_value', ['defend_dodge_rate', 'counter_damage_reduce_rate']],
    ['defend_parry_value', ['defend_parry_rate', 'defend_parry_reduce_rate', 'perfect_parry_damage_reduce_rate']],
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
    SF: ['attack_attribute_ice_value', 'attack_attribute_earth_value']
}

const CharacterStats = (props) => {
    let attack = []
    let defense = []

    let classCode = props.classCode

    attackStats.forEach((stat, i) => {
        let subValues = []
        if (!stat[0].startsWith('attack_attribute') || (classElements[classCode][0] === stat[0] || classElements[classCode][1] === stat[0])) {
            if (stat[0] !== 'attack_stiff_duration_level') {
                subValues.push(
                    <div key='base'>
                        <span className='subHeader'>{props.uiText.get('base')}</span>
                        <span className='subValue'>{props.statData.getIn(['base_ability', stat[0]], 0)}</span>
                    </div>,
                    <div key='equip'>
                        <span className='subHeader'>{props.uiText.get('equip')}</span>
                        <span className='subValue'>{props.statData.getIn(['equipped_ability', stat[0]], 0)}</span>
                    </div>
                )
                stat[1].forEach(extra => {
                    subValues.push(
                        <div key={extra}>
                            <span className='subHeader'>{props.uiText.get(extra)}</span>
                            <span className='subValue'>
                                {props.statData.getIn(['total_ability', extra], 0)}
                                {extra.endsWith('rate') ? '%' : ''}
                            </span>
                        </div>
                    )
                })
            }
            else {
                subValues.push(
                    <div key='duration'>
                        <span className='subHeader'>{props.uiText.get('attack_stiff_duration_rate')}</span>
                        <span className='subValue'>{props.statData.getIn(['total_ability', stat[0]], 0) * 20}%</span>
                    </div>
                )
            }

            let header = <span>
                {props.uiText.get(stat[0])}
                <span className='mainValue'>
                    {stat[0] === 'attack_stiff_duration_level' ? `${props.uiText.get('level')} ` : ''}
                    {props.statData.getIn(['total_ability', stat[0]], 0)}
                </span>
            </span>

            attack.push(
                <Collapse.Panel header={header} className='statItem' bordered={false} key={i}>
                    <div>
                        {subValues}
                    </div>
                </Collapse.Panel>
            )
        }
    })

    defenseStats.forEach((stat, i) => {
        let subValues = []
        if (stat[0] !== 'defend_stiff_duration_level') {
            if (stat[0] != 'int_hp_regen') {
                subValues.push(
                    <div key='base'>
                        <span className='subHeader'>{props.uiText.get('base')}</span>
                        <span className='subValue'>{props.statData.getIn(['base_ability', stat[0]], 0)}</span>
                    </div>,
                    <div key='equip'>
                        <span className='subHeader'>{props.uiText.get('equip')}</span>
                        <span className='subValue'>{props.statData.getIn(['equipped_ability', stat[0]], 0)}</span>
                    </div>
                )
            }
            stat[1].forEach(extra => {
                subValues.push(
                    <div key={extra}>
                        <span className='subHeader'>{props.uiText.get(extra)}</span>
                        <span className='subValue'>
                            {props.statData.getIn(['total_ability', extra], 0)}
                            {extra.endsWith('rate') ? '%' : ''}
                        </span>
                    </div>
                )
            })
        }
        else {
            subValues.push(
                <div key='duration'>
                    <span className='subHeader'>{props.uiText.get('defend_stiff_duration_rate')}</span>
                    <span className='subValue'>{props.statData.getIn(['total_ability', stat[0]], 0) * 20}%</span>
                </div>
            )
        }

        let header = <span>
            {props.uiText.get(stat[0])}
            <span className='mainValue'>
                {stat[0] === 'defend_stiff_duration_level' ? `${props.uiText.get('level')} ` : ''}
                {props.statData.getIn(['total_ability', stat[0]], 0)}
            </span>
        </span>
        defense.push(
            <Collapse.Panel header={header} className='statItem' bordered={false} key={i}>
                <div>
                    {subValues}
                </div>
            </Collapse.Panel>
        )
    })

    let hmAttack = props.statData.getIn(['point_ability', 'offense_point'], 0)
    let attackPointMenu =
        <div>
            <h5>{props.uiText.get('attackPoints')} <span>{hmAttack}P</span></h5>
            <div className='mainHmStat'>
                <img src={attackImg}/>
                <p>
                    {props.uiText.get('attack_power_value')}
                    <span>{hmAttack}</span>
                </p>
            </div>
            <div className='mainHmStat'>
                <img src={attackImg}/>
                <p>
                    {props.uiText.get('elementDamage')}
                    <span>{hmAttack * 2}</span>
                </p>
            </div>
            <hr/>
            <div className='additionalEffects'>
                <h5>{props.uiText.get('additionalEffects')}</h5>
                <table>
                    <tbody>
                        <tr className={hmAttack >= 10 ? 'active' : ''}>
                            <th>10</th>
                            <td>{props.uiText.get('attack_power_value')} +60, {props.uiText.get('elementDamage')} +60</td>
                        </tr>
                        <tr className={hmAttack >= 20 ? 'active' : ''}>
                            <th>20</th>
                            <td>{props.uiText.get('attack_power_value')} +40, {props.uiText.get('elementDamage')} +50</td>
                        </tr>
                        <tr className={hmAttack >= 50 ? 'active' : ''}>
                            <th>50</th>
                            <td>{props.uiText.get('attack50Effect')}</td>
                        </tr>
                        <tr className={hmAttack >= 80 ? 'active' : ''}>
                            <th>80</th>
                            <td>{props.uiText.get('attack_power_value')} +20, {props.uiText.get('elementDamage')} +30</td>
                        </tr>
                        <tr className={hmAttack >= 100 ? 'active' : ''}>
                            <th>100</th>
                            <td>{props.uiText.get('attack_power_value')} +10, {props.uiText.get('elementDamage')} +20</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    let hmDefense = props.statData.getIn(['point_ability', 'defense_point'], 0)
    let defensePointMenu =
        <div>
            <h5>{props.uiText.get('defensePoints')} <span>{hmDefense}P</span></h5>
            <div className='mainHmStat'>
                <img src={healthImg}/>
                <p>
                    {props.uiText.get('max_hp')}
                    <span>{hmDefense * 250}</span>
                </p>
            </div>
            <div className='mainHmStat'>
                <img src={defenseImg}/>
                <p>
                    {props.uiText.get('defend_power_value')}
                    <span>{hmDefense * 5}</span>
                </p>
            </div>
            <hr/>
            <table className='additionalEffects'>
                <tbody>
                    <tr className={hmDefense >= 10 ? 'active' : ''}>
                        <th>10</th>
                        <td>{props.uiText.get('max_hp')} +20000, {props.uiText.get('defend_power_value')} +105</td>
                    </tr>
                    <tr className={hmDefense >= 20 ? 'active' : ''}>
                        <th>20</th>
                        <td>{props.uiText.get('max_hp')} +15000, {props.uiText.get('defend_power_value')} +85</td>
                    </tr>
                    <tr className={hmDefense >= 50 ? 'active' : ''}>
                        <th>50</th>
                        <td>{props.uiText.get('defense50Effect')}</td>
                    </tr>
                    <tr className={hmDefense >= 80 ? 'active' : ''}>
                        <th>80</th>
                        <td>{props.uiText.get('max_hp')} +10000, {props.uiText.get('defend_power_value')} +45</td>
                    </tr>
                    <tr className={hmDefense >= 100 ? 'active' : ''}>
                        <th>100</th>
                        <td>{props.uiText.get('max_hp')} +5000, {props.uiText.get('defend_power_value')} +30</td>
                    </tr>
                </tbody>
            </table>
        </div>

    return (
        <div className='characterStats'>
            <div className='attack'>
                <div className='mainStat'>
                    <h4>{props.uiText.get('attack_power_value')}</h4>
                    <h3 className='mainValue'>{props.statData.getIn(['total_ability', 'attack_power_value'], 0)}</h3>
                    <hr/>
                    <Tooltip placement='bottom' title={attackPointMenu} trigger='click' overlayClassName='hmPointMenu'>
                        <p>{props.uiText.get('attackPoints')} {hmAttack}P</p>
                    </Tooltip>
                </div>
                <div className='subStatsContainer'>
                    <Collapse className='subStats' bordered={false}>
                        {attack}
                    </Collapse>
                </div>
            </div>
            <div className='defense'>
                <div className='mainStat'>
                    <h4>{props.uiText.get('max_hp')}</h4>
                    <h3 className='mainValue'>{props.statData.getIn(['total_ability', 'max_hp'], 0)}</h3>
                    <hr/>
                    <Tooltip placement='bottom' title={defensePointMenu} trigger='click' overlayClassName='hmPointMenu'>
                        <p>{props.uiText.get('defensePoints')} {hmDefense}P</p>
                    </Tooltip>
                </div>
                <div className='subStatsContainer'>
                    <Collapse className='subStats' bordered={false}>
                        {defense}
                    </Collapse>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(CharacterStats)
