import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {Slider, InputNumber, Radio, Menu, Dropdown, Icon} from 'antd'

import {
    uiTextSelector
} from '../selector'
import {setStat, changeSubStat} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SS_TOOLTIP', Map()),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setStat: (piece, type, value, subStat) => dispatch(setStat(piece, type, value, subStat)),
        changeSub: (piece, i, subStat) => dispatch(changeSubStat(piece, i, subStat))
    }
}

const StatControl = (props) => {
    let valueController = null
    let statHeader = props.uiText.get(props.stat)

    let currentSubStat = null
    if (props.subStats) {
        currentSubStat = props.stat
        let subStats = []
        props.subStats.forEach(s => {
            subStats.push(<Menu.Item key={s}>{props.uiText.get(s)}</Menu.Item>)
        })
        let menu = <Menu onClick={(s) => props.changeSub(props.p, props.type, s.key)}>
            {subStats}
        </Menu>

        statHeader = <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
                {props.uiText.get(props.stat)} <Icon type="down" />
            </a>
        </Dropdown>
    }

    if (props.slideControl) {
        let marks = {}
        marks[props.statValues.get(0)] = props.statValues.get(0)
        marks[props.statValues.get(1)] = props.statValues.get(1)

        valueController = <td>
            <span className='sliderWrap'>
                <Slider onChange={(v) => props.setStat(props.p, props.type, v / (props.stat == 'health' && props.type != 'm1Value' ? 10 : 1), currentSubStat)}
                    marks={marks}
                    min={props.statValues.get(0)}
                    max={props.statValues.get(1)}
                    value={props.currentValue}
                    step={props.stat == 'health' ? 10 : 1}
                />
            </span>
            <InputNumber
                onChange={(v) => props.setStat(props.p, props.type, v / (props.stat == 'health' && props.type != 'm1Value' ? 10 : 1), currentSubStat)}
                min={props.statValues.get(0)}
                max={props.statValues.get(1)}
                value={props.currentValue}
                size='small'
            />
        </td>
    }
    else {
        if (props.type !== 'double') {
            let values = props.statValues.sort().map((v, i) => {
                return (
                    <Radio.Button value={v} key={i}>{v}</Radio.Button>
                )
            })

            valueController = <td>
                <Radio.Group value={props.currentValue} size='small' onChange={(e) => props.setStat(props.p, props.type, e.target.value, currentSubStat)}>
                    {values}
                </Radio.Group>
            </td>
        }
        else {
            let m1Values = props.statValues[0].sort()
            let m2Values = props.statValues[1].sort()
            statHeader = `${props.uiText.get(props.stat[0])} / ${props.uiText.get(props.stat[1])}`

            let values = []
            m1Values.forEach((m1, i) => {
                let m2 = m2Values.get(i)
                values.push(
                    <Radio.Button value={i} key={i}>{m1} / {m2}</Radio.Button>
                )
            })

            valueController = <td>
                <Radio.Group value={m1Values.indexOf(props.currentValue[0])} size='small' onChange={(e) => {
                    props.setStat(props.p, 'm1Value', m1Values.get(e.target.value))
                    props.setStat(props.p, 'm2Value', m2Values.get(e.target.value))
                }}>
                    {values}
                </Radio.Group>
            </td>
        }
    }

    return (
        <table className='statController'>
            <tbody>
                <tr>
                    <th>{statHeader}</th>
                    {valueController}
                </tr>
            </tbody>
        </table>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(StatControl)
