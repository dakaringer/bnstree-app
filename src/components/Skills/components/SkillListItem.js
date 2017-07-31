import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'

import {Tooltip} from 'antd'

import typeImages from '../images/map_typeImg'
import keyImages from '../images/map_keyImg'

import SkillTooltip from './SkillTooltip'

import {
    filterSelector
} from '../selectors'
import {learnMove} from '../actions'

const types = {
    'BASIC' :  't33',
    'DAMAGE' : 't3', 
    'DAMAGE_UP' : 't3',
    'DAMAGE_ADD' : 't3',
    'DAMAGE_TIME' : 't3',
    'HEAL' : 't15',
    'LIFESTEAL' : 't15',
    'FOCUS_REGEN' : 't15',
    'AREA' : 't5',
    'AREA_UP' : 't5',
    'CD_REDUCTION' : 't20',
    'CHARGE' : 't6',
    'SPEED_UP' : 't7',
    'CRITICAL' : 't2',
    'CRITICAL_UP' : 't7',
    'SELF_BUFF' : 't4',
    'PARTY_BUFF' : 't18',
    'DEFENSE' : 't14',
    'DEFENSE_UP' : 't7',
    'DAMAGE_REDUCTION' : 't14',
    'BLOCK' : 't14',
    'COUNTER' : 't14',
    'DEFLECT' : 't14',
    'OFFENSIVE_DEFENSE' : 't14',
    'RESIST' : 't13',
    'STATUS_RESIST' : 't13',
    'PROJECTILE_RESIST' : 't19',
    'PARTY_PROTECTION' : 't19',
    'STUN' : 't8',
    'DAZE' : 't9',
    'KNOCKDOWN' : 't10',
    'KNOCKBACK' : 't11',
    'UNCONSCIOUS' : 't30',
    'PULL' : 't28',
    'SLOW' : 't22',
    'ROOT' : 't25',
    'FREEZE' : 't25',
    'FROST_PRISON' : 't25',
    'DEFENSE_DOWN' : 't22',
    'AERIAL' : 't27',
    'GRAPPLE' : 't26',
    'PHANTOM_GRIP' : 't26',
    'DEFENSE_BREAK' : 't16',
    'DEFENSE_PENETRATION' : 't16',
    'DEFLECT_PENETRATION' : 't16',
    'CHARGE_DISABLE' : 't12',
    'DEFENSE_DISABLE' : 't12',
    'TARGET_BLOCK' : 't12',
    'ESCAPE' : 't24',
    'AWAKENED' : 't23',
    'RESTRAIN' : 't23',
    'MOVEMENT' : 't6',
    'ACCELERATED' : 't32',
    'COMBO' : 't21',
    'STANCE_CHANGE' : 't33',
    'TAUNT' : 't17',
    'THREAT' : 't17',
    'WINDWALK' : 't29',
    'REVIVE' : 't19',
    'PROJECTILE' : 't33',
    'FAMILIAR' : 't33'
}

const mapStateToProps = (state) => {
    return {
        filter: filterSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        learnMove: (skill, move) => dispatch(learnMove(skill, move))
    }
}

const SkillListItem = (props) => {
    const {t, skillData, skillId, learnMove, filter} = props
    
    let offset = skillData.getIn(['moves', 0, 'move'], 1) - 1

    let currentMove = skillData.get('currentMove', 1)
    let moveIndex = 0
    skillData.get('moves', List()).forEach((m, i) => {
        if (m.get('move', 1) === currentMove + offset) {
            moveIndex = i
            return false
        }
    })

    let moves = []
    skillData.get('moves', List()).forEach((move, i) => {
        let moveNumber = move.get('move', 1)
        if (moveNumber > 3) {
            return false
        }
        moveNumber = moveNumber - offset
        
        let type = move.get('type', 'BASIC')

        let tooltip = <SkillTooltip moveData={move} comparisonData={skillData.getIn(['moves', moveIndex], move)}/>

        let hm = null
        skillData.get('moves', List()).forEach((hmMove, j) => {
            if (hmMove.get('move') === moveNumber + 3) {
                let hmTooltip = <SkillTooltip moveData={hmMove} comparisonData={skillData.getIn(['moves', moveIndex], hmMove)}/>
                if (currentMove === moveNumber + 3) {
                    tooltip = hmTooltip
                    moveIndex = j
                    type = hmMove.get('type', 'BASIC')
                }
                hm = <Tooltip placement='bottomLeft' title={hmTooltip} align={{overflow: {adjustY: false, adjustX: true}}} overlayClassName='skill-tooltip-wrap'>
                    <div className={`hmButton ${currentMove === moveNumber + 3 ? 'active' : ''}`} onClick={() => learnMove(skillId, currentMove === moveNumber + 3 ? moveNumber : moveNumber + 3)}>
                    </div>
                </Tooltip>
                return false
            }
        })

        moves.push(
            <div key={moveNumber} className={`skill-move-wrapper ${move.get('filter', List()).includes(filter) ? 'filtered': ''}`}>
                <Tooltip placement='bottomLeft' title={tooltip} align={{overflow: {adjustY: false, adjustX: true}}} overlayClassName='skill-tooltip-wrap'>
                    <div className={`skill-move ${currentMove === moveNumber || currentMove === moveNumber + 3 ? 'current' : ''}`} onClick={() => learnMove(skillId, currentMove === moveNumber + 3 ? moveNumber + 3 : moveNumber)}>
                        <h6>{t(type)}</h6>
                        <img src={typeImages[types[type]]} alt={types[type]} className='typeImg'/>
                    </div>
                </Tooltip>
                {hm}
            </div>
        )
    })

    let mainTooltip = <SkillTooltip moveData={skillData.getIn(['moves', moveIndex])} comparisonData={skillData.getIn(['moves', moveIndex])}/>

    let hotkeyImg = skillData.get('hotkey') !== 'None' ? <img className='skill-hotkey' alt={skillData.get('hotkey')} src={keyImages[skillData.get('hotkey')]}/> : null

    return (
        <div className='skill-list-item'>
            <Tooltip placement="bottomLeft" title={mainTooltip} align={{overflow: {adjustY: false, adjustX: true}}} overlayClassName='skill-tooltip-wrap'>
                <img className='skill-icon' alt={skillId} src={`https://static.bnstree.com/images/skill/${skillData.getIn(['moves', moveIndex, 'icon'])}`}/>
            </Tooltip>
            <div>
                <h4 className='skill-name'>{skillData.getIn(['moves', moveIndex, 'name'])}{hotkeyImg}</h4>
                <div className={`skill-moves ${moves.length === 1 ? 'single' : ''}`}>
                    {moves}
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillListItem))
