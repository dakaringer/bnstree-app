import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'
import {Tooltip, Collapse, Menu, Dropdown, Icon, Slider, InputNumber} from 'antd'
import {Col} from 'antd'

import SSTooltip from './SSTooltip'
import blank from '../images/blank.gif'
import bg_gem from '../images/bg_gem.png'
import pieceImages from '../images/map_pieceImg'
import {generateSetEffect} from '../helper'

import {
    uiTextSelector,
    equipDataSelector,
    dataSelector,
    skillSelector,
    templateSelector
} from '../selector'
import {unequipPiece, setStat} from '../actions'

import StatController from './SSStatController'

const statOrder = [
    'ap',
    'eap',
    'piercing',
    'accuracy',
    'critical',
    'criticalDamage',
    'statusDamage',
    'health',
    'defense',
    'evasion',
    'block',
    'criticalDefense'
]

const fusionStats = [
    'none',
    'critical',
    'accuracy',
    'block',
    'evasion',
    'piercing',
    'defense',
    'criticalDefense'
]

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SS_TOOLTIP', Map()),
        equipData: equipDataSelector(state),
        ssData: dataSelector(state),
        skillRef: skillSelector(state),
        templates: templateSelector(state),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        unequip: (e, piece) => {
            e.preventDefault()
            dispatch(unequipPiece(piece))
        },
        setStat: (piece, type, value, subStat) => dispatch(setStat(piece, type, value, subStat))
    }
}

class SSEquip extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            hover: null
        }
    }

    hover(piece) {
        this.setState({
            hover: piece
        })
    }

    render() {
        let setPieces = []
        let total = Map()
        let setCount = Map()
        let setEffects = Map()

        this.props.equipData.forEach((v, piece) => {
            if (v) {
                let data = this.props.ssData.get(v.get('id'))

                total = total.setIn(['health', 'base'], total.getIn(['health', 'base'], 0) + v.get('m1Value'))
                let m2Stat = data.getIn(['pieceData', piece, 'm2', 'stat'])
                total = total.setIn([m2Stat, 'base'], total.getIn([m2Stat, 'base'], 0) + (v.get('m2Value') * (m2Stat == 'health' ? 10 : 1)))

                v.get('sub', List()).forEach(subStat => {
                    total = total.setIn([subStat.get(0), 'base'], total.getIn([subStat.get(0), 'base'], 0) + (subStat.get(1) * (subStat.get(0) == 'health' ? 10 : 1)))
                })

                let fuseStat = v.getIn(['fuse', 'stat'], 'none')
                if (fuseStat != 'none') {
                    total = total.setIn([fuseStat, 'fuse'], total.getIn([fuseStat, 'fuse'], 0) + (v.getIn(['fuse', 'value'], 0) * (fuseStat == 'health' ? 10 : 1)))
                }

                let count = setCount.get(v.get('setId'), 0) + 1
                setCount = setCount.set(v.get('setId'), count)
                if (data.hasIn(['setEffect', `s${count}`])) {
                    let effects = setEffects.get(v.get('id'), [])
                    effects.push(generateSetEffect(count, count, data, this.props.templates, this.props.skillRef, this.props.uiText))
                    setEffects = setEffects.set(v.get('id'), effects)

                    if (data.hasIn(['setEffect', `s${count}`, 'stats'])) {
                        data.getIn(['setEffect', `s${count}`, 'stats'], List()).forEach(s => {
                            total = total.setIn([s.get(0), 'set'], total.getIn([s.get(0), 'set'], 0) + s.get(1))
                        })
                    }
                }

                let tooltip = <SSTooltip tooltipData={data} piece={piece.charAt(1)} equipData={v} id={v.get('id')}/>
                setPieces.push(
                    <Tooltip placement="leftTop" title={tooltip} mouseLeaveDelay={0} align={{overflow: {adjustY: false, adjustX: true}}} key={piece} visible={piece == this.state.hover} overlayClassName='ssTooltipWrap'>
                        <img className={`piece ${piece}`} src={`/images/soulshield/pieces/equipgem_${data.get('iconPrefix')}_extra_pos${piece.charAt(1)}.png`}/>
                    </Tooltip>
                )
            }
        })

        let totalStats = []
        total.sortBy((v, k) => k, (a, b) => {
            return statOrder.indexOf(a) - statOrder.indexOf(b)
        }).forEach((v, k) => {
            if (k) {
                totalStats.push(
                    <tr key={k}>
                        <th>{this.props.uiText.get(k)}</th>
                        <td className='total'>{v.get('base', 0) + v.get('set', 0) + v.get('fuse', 0)}</td>
                        <td className='breakdown'>(<span>{v.get('base', 0)}</span> + <span className='set'>{v.get('set', 0)}</span> + <span className='fuse'>{v.get('fuse', 0)}</span>)</td>
                    </tr>
                )
            }
        })

        let setEffectsDiv = []
        setEffects.sortBy((v, k) => parseInt(k), (a, b) => a - b).forEach((v, k) => {
            let data = this.props.ssData.get(k)
            let effectName = data.get('effectName')

            setEffectsDiv.push(
                <div key={k}>
                    <p className='effectName'>{effectName}</p>
                    {v}
                </div>
            )
        })

        let statControls = []
        for (let i = 1; i <= 8; i++) {
            let p = `p${i}`
            let equipData = this.props.equipData.get(p)

            if (equipData) {
                let pieceData = this.props.ssData.getIn([equipData.get('id'), 'pieceData', p], Map())
                let m2Stat = pieceData.getIn(['m2', 'stat'])

                let controls = []
                let slideControl = this.props.ssData.getIn([equipData.get('id'), 'grade']) == 7 || this.props.ssData.getIn([equipData.get('id'), 'evolve'])

                let m1Values = pieceData.get('m1')
                if (m2Stat == 'health') {
                    m1Values = m1Values.map((v, i) => {
                        return v + pieceData.getIn(['m2', 'values', i]) * 10
                    })
                }

                if (!slideControl && m2Stat && m2Stat != 'health') {
                    controls.push(
                        <StatController stat={['health', m2Stat]}
                            currentValue={[equipData.get('m1Value'), equipData.get('m2Value')]}
                            statValues={[m1Values, pieceData.getIn(['m2', 'values'])]}
                            slideControl={slideControl}
                            p={p}
                            type='double'
                            key='m1'
                        />
                    )
                }
                else {
                    controls.push(
                        <StatController stat={'health'}
                            currentValue={equipData.get('m1Value')}
                            statValues={m1Values}
                            slideControl={slideControl}
                            p={p}
                            type='m1Value'
                            key='m1'
                        />
                    )
                    if (m2Stat && m2Stat != 'health') {
                        controls.push(
                            <StatController stat={m2Stat}
                                currentValue={equipData.get('m2Value')}
                                statValues={pieceData.getIn(['m2', 'values'])}
                                slideControl={slideControl}
                                p={p}
                                type='m2Value'
                                key='m2'
                            />
                        )
                    }
                }

                let selectedStats = []
                for (let i = 0; i < pieceData.getIn(['sub', 'limit'], 0); i++) {
                    selectedStats.push(equipData.getIn(['sub', i, 0]))
                }
                let pool = pieceData.getIn(['sub', 'stats'], List()).filter(s => selectedStats.indexOf(s) < 0)

                selectedStats.forEach((s, i) => {
                    let subStat = equipData.getIn(['sub', i])
                    let statValues = pieceData.getIn(['sub', 'values'])
                    if (s == 'health') {
                        statValues = pieceData.getIn(['sub', 'healthValues'], statValues).map(a => a * 10)
                    }
                    controls.push(
                        <StatController stat={s}
                            currentValue={subStat.get(1) * (s == 'health' ? 10 : 1)}
                            subStats={pool}
                            statValues={statValues}
                            slideControl={slideControl}
                            p={p}
                            type={i}
                            key={i}
                        />
                    )
                })

                let m = []
                fusionStats.map(s => m.push(<Menu.Item key={s}>{this.props.uiText.get(s)}</Menu.Item>))
                let menu = <Menu onClick={(s) => this.props.setStat(p, 'fusion', equipData.getIn(['fuse', 'value'], 0), s.key)}>
                    {m}
                </Menu>

                let currentFuseStat = equipData.getIn(['fuse', 'stat'])
                let fusionDropdown = <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">
                        {this.props.uiText.get(currentFuseStat)} <Icon type="down" />
                    </a>
                </Dropdown>

                let marks = {}
                marks[0] = 0
                marks[pieceData.get('maxFuse')] = pieceData.get('maxFuse')

                let fusionController = null
                if (currentFuseStat != 'none') {
                    fusionController = <td>
                        <span className='sliderWrap'>
                            <Slider onChange={(v) => this.props.setStat(p, 'fusion', v, currentFuseStat)}
                                marks={marks}
                                min={0}
                                max={pieceData.get('maxFuse')}
                                value={equipData.getIn(['fuse', 'value'])}
                                step={currentFuseStat == 'health' ? 10 : 1}
                            />
                        </span>
                        <InputNumber onChange={(v) => this.props.setStat(p, 'fusion', v, currentFuseStat)}
                            marks={marks}
                            min={0}
                            max={pieceData.get('maxFuse')}
                            value={equipData.getIn(['fuse', 'value'])}
                            step={currentFuseStat == 'health' ? 10 : 1}
                            size='small'
                        />
                    </td>
                }

                statControls.push(
                    <div key={i} className='piece'>
                        <img src={pieceImages[p]}/>
                        <div className='control'>
                            {controls}
                            <hr/>
                            <h6>{this.props.uiText.get('fusion')}</h6>
                            <table className='statController'>
                                <tbody>
                                    <tr>
                                        <th>{fusionDropdown}</th>
                                        {fusionController}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
            else {
                statControls.push(
                    <div key={i} className='piece'>
                        <img src={pieceImages[p]}/>
                        <div className='control'>
                            -
                        </div>
                    </div>
                )
            }
        }

        return (
            <Col lg={{span: 10, push: 14}} className='ssEquip'>
                <div className='imagePreview'>
                    <img className='blankImg' src={blank} useMap='#map' width='240' height='240' />
                    <map name="map">
                        <area shape="poly" coords="120,120,70,0,170,0" onMouseOver={() => this.hover('p1')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p1')}/>
                        <area shape="poly" coords="120,120,170,0,240,70" onMouseOver={() => this.hover('p2')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p2')}/>
                        <area shape="poly" coords="120,120,240,70,240,170" onMouseOver={() => this.hover('p3')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p3')}/>
                        <area shape="poly" coords="120,120,240,170,170,240" onMouseOver={() => this.hover('p4')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p4')}/>
                        <area shape="poly" coords="120,120,170,240,70,240" onMouseOver={() => this.hover('p5')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p5')}/>
                        <area shape="poly" coords="120,120,70,240,0,170" onMouseOver={() => this.hover('p6')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p6')}/>
                        <area shape="poly" coords="120,120,0,170,0,70" onMouseOver={() => this.hover('p7')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p7')}/>
                        <area shape="poly" coords="120,120,0,70,70,0" onMouseOver={() => this.hover('p8')} onMouseOut={() => this.hover(null)} onContextMenu={(e) => this.props.unequip(e, 'p8')}/>
                    </map>
                    {setPieces}
                    <img className='setBackground' src={bg_gem}/>
                </div>
                <Collapse bordered={false} defaultActiveKey={['1']} className='details' accordion>
                    <Collapse.Panel header={this.props.uiText.get('totalStats')} key="1">
                        <div className='effects'>
                            <table className='totalStats'>
                                <tbody>
                                    {totalStats}
                                </tbody>
                            </table>
                            <div className='setEffect'>
                                {setEffectsDiv}
                            </div>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header={this.props.uiText.get('statControl')} className='statControls' key="2">
                        {statControls}
                    </Collapse.Panel>
                </Collapse>
            </Col>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSEquip)
