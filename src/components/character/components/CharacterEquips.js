import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import blank from '../images/blank.gif'
import bg_gem from '../images/bg_gem.png'
import {Tooltip} from 'antd'

import CharacterItemTooltip from './CharacterItemTooltip'

import {uiTextSelector, characterSelector} from '../selector'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('CHARACTER_EQUIPS', Map()),
        stats: uiTextSelector(state).get('CHARACTER_STATS', Map()),
        equipData: characterSelector(state).get('equipData', Map())
    }
}

class CharacterEquips extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            hover: null
        }
    }

    hover(piece) {
        this.setState({hover: piece})
    }

    profileError(e) {
        e.target.style.visibility = 'hidden'
    }

    render() {
        let equips = []
        let equipList = [
            'hand',
            'finger_left',
            'ear_left',
            'neck',
            'bracelet',
            'belt',
            'gloves',
            'soul',
            'pet',
            'soul_badge',
            'swift_badge',
            'body',
            'body_accessory',
            'head',
            'eye'
        ]

        equipList.forEach(e => {
            let item = this.props.equipData.getIn([
                'equipment', e, 'item'
            ], Map())

            let itemName = item.get('name', '')
            if (itemName === '') {
                itemName = this.props.uiText.get(e)
            }
            let grade = item.get('grade', '0')
            let icon = item.get('icon')
            if (e == 'pet') {
                icon = this.props.equipData.getIn([
                    'equipment', e, 'appearance_item', 'icon'
                ], icon)
            }

            let tooltip = <CharacterItemTooltip data={this.props.equipData.getIn(['equipment', e])} piece={e}/>

            if (e == 'hand') {
                let gemData = this.props.equipData.getIn([
                    'equipment', e, 'added_gems'
                ], Map())
                let gems = []
                gemData.forEach((g, i) => {
                    gems.push(<img key={i} src={g.get('icon_transparent')}/>)
                })
                equips.push(
                    <div className='item weapon' key={e}>
                        <div className='imgContainer'>
                            <Tooltip placement='leftTop' title={tooltip} trigger='hover' overlayClassName='itemTooltip'>
                                <img src={icon} onError={this.profileError}/>
                            </Tooltip>
                        </div>
                        <div className='weaponDetails'>
                            <p className={`grade_${grade}`}>{itemName}</p>
                            <div className='gems' key='gems'>
                                {gems}
                            </div>
                        </div>
                    </div>
                )
            } else {
                equips.push(
                    <div className='item' key={e}>
                        <div className='imgContainer'>
                            <Tooltip placement='leftTop' title={tooltip} trigger='hover' overlayClassName='itemTooltip'>
                                <img src={icon} onError={this.profileError}/>
                            </Tooltip>
                        </div>
                        <p className={`grade_${grade}`}>{itemName}</p>
                    </div>
                )
            }
        })

        let setPieces = []
        this.props.equipData.getIn([
            'soulshield', 'soulshieldPieces'
        ], Map()).forEach((p, k) => {
            let tooltip = <CharacterItemTooltip data={p} piece={k}/>
            setPieces.push(
                <Tooltip key={k} placement='leftTop' title={tooltip} visible={k == this.state.hover} overlayClassName='itemTooltip'>
                    <img className={`piece ${k}`} src={p.getIn(['item', 'icon_extra'])}/>
                </Tooltip>
            )
        })

        let ssStats = []
        let stats = [
            'attack_power_value',
            'attack_pierce_value',
            'attack_hit_value',
            'attack_critical_value',
            'max_hp',
            'defend_power_value',
            'defend_dodge_value',
            'defend_parry_value',
            'defend_critical_value'
        ]

        stats.forEach(s => {
            let base = this.props.equipData.getIn([
                'soulshield', 'soulshieldStats', 'base_ability', s
            ], 0)
            let fuse = this.props.equipData.getIn([
                'soulshield', 'soulshieldStats', 'extra_ability', s
            ], 0)
            let set = this.props.equipData.getIn([
                'soulshield', 'soulshieldStats', 'set_ability', s
            ], 0)
            let total = base + fuse + set
            if (total > 0) {
                ssStats.push(
                    <tr key={s}>
                        <th>{this.props.stats.get(s)}</th>
                        <td className='total'>
                            {total}
                        </td>
                        <td>
                            ({base}
                            +
                            <span className='bonus'>{fuse}</span>
                            +
                            <span className='bonus'>{set}</span>)
                        </td>
                    </tr>
                )
            }
        })

        let ssEffects = []
        this.props.equipData.getIn([
            'soulshield', 'soulshieldEffects'
        ], Map()).forEach((s, k) => {
            let set = s.get('set_item', Map())
            let part_effects = []
            set.get('item_effects').sortBy(part => part.get('part_effects')).forEach((part, i) => {
                let effects = []
                if (part.get('affected')) {
                    part.get('part_effects').forEach((effect, i) => {
                        effects.push(
                            <p key={i} className='description'>{effect.get('skill_name')} {effect.get('description')}</p>
                        )
                    })
                }
                if (effects.length > 0) {
                    part_effects.push(
                        <div key={i}>
                            <span className='setLabel'>{part.get('part_count')}</span>
                            {effects}
                        </div>
                    )
                }
            })

            if (part_effects.length > 0) {
                ssEffects.push(
                    <div key={k} className='setEffects'>
                        <h6>{set.get('name')}</h6>
                        {part_effects}
                    </div>
                )
            }
        })

        let ssStatDiv = <div>
            <h5>{this.props.uiText.get('ssEffects')}
                <small>
                    ({this.props.uiText.get('ssBase')}
                    +
                    <span className='bonus'>{this.props.uiText.get('ssFuse')}</span>
                    +
                    <span className='bonus'>{this.props.uiText.get('ssSet')}</span>)
                </small>
            </h5>
            <table>
                <tbody>
                    {ssStats}
                </tbody>
            </table>
            <div className='ssEffects'>
                {ssEffects}
            </div>
        </div>

        return (
            <div className='characterEquips'>
                <div>
                    {equips}
                </div>

                <div className='ssBlock'>
                    <div className='imagePreview'>
                        <img className='blankImg' src={blank} useMap='#map' width='240' height='240'/>
                        <map name="map">
                            <area shape="poly" coords="120,120,70,0,170,0" onMouseOver={() => this.hover('soulshield_1')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,170,0,240,70" onMouseOver={() => this.hover('soulshield_2')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,240,70,240,170" onMouseOver={() => this.hover('soulshield_3')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,240,170,170,240" onMouseOver={() => this.hover('soulshield_4')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,170,240,70,240" onMouseOver={() => this.hover('soulshield_5')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,70,240,0,170" onMouseOver={() => this.hover('soulshield_6')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,0,170,0,70" onMouseOver={() => this.hover('soulshield_7')} onMouseOut={() => this.hover(null)}/>
                            <area shape="poly" coords="120,120,0,70,70,0" onMouseOver={() => this.hover('soulshield_8')} onMouseOut={() => this.hover(null)}/>
                        </map>
                        {setPieces}
                        <img className='setBackground' src={bg_gem}/>
                    </div>
                    <Tooltip placement='topRight' title={ssStatDiv} trigger='click' overlayClassName='ssStats'>
                        <p className='ssStatsDisplay'>{this.props.uiText.get('ssEffectsShow')}</p>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(CharacterEquips)
