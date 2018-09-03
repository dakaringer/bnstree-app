import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {Tooltip} from 'antd'

import SSTooltip from './SSTooltip'

import {
    uiTextSelector,
    equipDataSelector
} from '../selector'
import {toggleEquip} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SS_SIDE_BAR', Map()),
        equippedPieces: equipDataSelector(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleEquip: (e, piece, id, error) => {
            e.preventDefault()
            dispatch(toggleEquip(piece, id, error))
        }
    }
}

const SSListItem = (props) => {
    let pieces = []
    let data = props.data

    for (let i = 1; i <= 8; i++) {
        let tooltip = <SSTooltip tooltipData={data} piece={i} equipData={props.equippedPieces.get(`p${i}`)} id={props.id}/>

        pieces.push(
            <Tooltip placement="bottomLeft" align={{points: ['bl', 'tr']}} title={tooltip} key={i} overlayClassName='ssTooltipWrap'>
                <a onClick={(e) => props.toggleEquip(e, `p${i}`, props.id, props.uiText.get('error'))}
                    onContextMenu={(e) => props.toggleEquip(e, `p${i}`, props.id, props.uiText.get('error'))}>
                    <img className={props.equippedPieces.getIn([`p${i}`, 'id']) == props.id ? 'equipped' : ''} src={`/images/soulshield/pieces/equipgem_${data.get('iconPrefix')}_pos${i}_${data.get('grade')}_1.png`}/>
                </a>
            </Tooltip>
        )
    }

    return (
        <div className='ssItem'>
            <img className='setIcon' src={`/images/soulshield/sets/Item_Set_${props.id}.png`}/>
            <div className='ssItem-pieces'>
                <h4 className={`ssName grade_${data.get('grade')}`}>{data.get('name')}</h4>
                <div className='pieces'>
                    {pieces}
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SSListItem)
