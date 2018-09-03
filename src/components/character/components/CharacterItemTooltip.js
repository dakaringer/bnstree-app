import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

//import bg_gem from '../images/bg_gem.png'

import {uiTextSelector} from '../selector'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('CHARACTER_EQUIPS', Map()),
        stats: uiTextSelector(state).get('CHARACTER_STATS', Map())
    }
}

const mainStat = {
    'hand': 'attack_power_equip_min_and_max',
    'finger_left': 'defend_dodge_value',
    'ear_left': 'attack_hit_value',
    'neck': 'attack_pierce_value',
    'bracelet': 'defend_parry_value',
    'belt': 'defend_power_equip_value',
    'gloves': 'attack_critical_damage_value',
    'soul': 'attack_power_equip_min_and_max',
    'pet': 'max_hp_equip'
}

const elements = {
    'Flame Damage' : 'attack_attribute_fire_value',
    'Frost Damage' : 'attack_attribute_ice_value',
    'Wind Damage' : 'attack_attribute_wind_value',
    'Earth Damage' : 'attack_attribute_earth_value',
    'Lightning Damage' : 'attack_attribute_lightning_value',
    'Shadow Damage' : 'attack_attribute_void_value'
}

const CharacterItemTooltip = (props) => {
    let data = props.data.get('item')
    let piece = props.piece
    let m1 = []
    let m2 = []
    let sub = []
    let extra = []
    let gemDiv = null

    if (data.get('item_skills').size > 0 && piece !== 'hand') {
        m1.push(
            <p key='badge' dangerouslySetInnerHTML={{__html: data.getIn(['item_skills', 0, 'name'])}}></p>
        )
        data.getIn(['item_skills', 0, 'descriptions']).forEach((desc, i) => {
            sub.push(
                <p key={i} className='font_green' dangerouslySetInnerHTML={{__html: desc}}></p>
            )
        })
    }
    else if (piece.startsWith('soulshield')) {
        data.get('main_abilities').forEach(m => {
            if (m.get('element')) {
                let base = m.get('value')
                let fuse = m.get('equip_value')
                let details = null
                if (fuse > 0) {
                    details = <span>({base} + <span className='font_green'>{fuse}</span>)</span>
                }

                let div =
                    <p key={m}>
                        {props.stats.get(m.get('element'))} <span className={fuse > 0 ? 'font_green' : ''}>{base + fuse}</span> {details}
                    </p>
                if (m.get('element') === 'max_hp') {
                    m1.push(div)
                }
                else {
                    m2.push(div)
                }
            }
        })
        data.get('sub_abilities').forEach(m => {
            if (m.get('element')) {
                let base = m.get('value')
                let fuse = m.get('equip_value')
                let details = null
                if (fuse > 0) {
                    details = <span>({base} + <span className='font_green'>{fuse}</span>)</span>
                }

                m2.push(
                    <p key={m}>
                        {props.stats.get(m.get('element'))} <span className={fuse > 0 ? 'font_green' : ''}>{base + fuse}</span> {details}
                    </p>
                )
            }
        })
    }
    else {
        if (piece == 'hand') {
            let gems = []
            props.data.get('added_gems').forEach((g, i) => {
                let stats = []
                if (g.get('main_abilities')) {
                    g.get('main_abilities').forEach((stat, j) => {
                        if (stat.get('element')) {
                            stats.push(
                                <p key={j}>{props.stats.get(stat.get('element'))} {stat.get('value')}</p>
                            )
                        }
                        else if (stat.get('text')) {
                            let text = stat.get('text')

                            text = text.replace(/\./g, '')
                            text = text.replace(/-/g, '·')
                            text = text.replace(/·/g, '\n ·')
                            text = text.replace('Upon Critical Hit', 'On critical hit')
                            text = text.replace('on Critical Hit', 'On critical hit')
                            text = text.replace('Triggers', 'RNG proc')
                            text = text.replace('when hit', 'on taking damage')
                            text = text.replace('on Evasion', 'On evasion')
                            text = text.replace('When an enemy is Stunned or Knocked Down', 'On hit to an enemy inflicted by stun, knockdown')
                            text = text.replace(/(\d+) HP Recovery Recovers (\d+) HP Over Time/, 'Recovery $1\nRecover $2 health over 5 sec')
                            text = text.replace(/Increases Critical by (\d+)/, 'Next $1 attacks have guaranteed critical hit')

                            stats.push(
                                <p key={j}>{text}</p>
                            )
                        }
                    })
                }

                gems.push(
                    <div className='gem' key={i}>
                        <img src={g.get('icon_transparent')}/>
                        <div className='gemStats'>
                            {stats}
                        </div>
                    </div>
                )
            })
            gemDiv = <div className='gems'>{gems}</div>
        }
        sub.push(
            <p key='sub' dangerouslySetInnerHTML={{__html: data.get('additional_ability_html')}}></p>
        )
        data.get('main_abilities').forEach(m => {
            if (m.get('value') > 0) {
                let element = m.get('element')
                if (!element) {
                    element = elements[m.get('name')]
                }
                let div = <p key={m}>{props.stats.get(element)} {m.get('value')}</p>
                if (mainStat[piece] == m.get('element')) {
                    m1.push(div)
                } else {
                    m2.push(div)
                }
            }
        })

        data.get('sub_abilities').forEach(m => {
            if (m.get('value') > 0) {
                m2.push(
                    <p key={m}>{props.stats.get(m.get('element'))} {m.get('value')}</p>
                )
            }
        })

        if (props.data.get('appearance_item')) {
            extra.push(
                <p key='appearance' className='extra'>{props.uiText.get('appearance')}: <span className={`grade_${props.data.getIn(['appearance_item', 'grade'])}`}>{props.data.getIn(['appearance_item', 'name'])}</span></p>
            )
        }
    }

    return (
        <div className='characterItemTooltip'>
            <div className='topBlock'>
                <h3 className={`name grade_${data.get('grade')}`}>
                    {data.get('name')}
                </h3>
            </div>
            <div className='mainBlock'>
                <div>
                    <img className='icon' src={data.get('icon')}/>
                </div>
                <div className='mainAttb'>
                    <div className='m1'>
                        {m1}
                    </div>
                    <div className='m2'>
                        {m2}
                    </div>
                </div>
            </div>
            <div className='subBlock'>
                <div className='sub'>
                    {sub}
                </div>
                {gemDiv}
                {extra}
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(CharacterItemTooltip)
