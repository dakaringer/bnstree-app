import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'

import {Tooltip} from 'antd'

import types from '../images/typeImg'
import typeImages from '../images/map_typeImg'
import keyImages from '../images/map_keyImg'

import SkillTooltip from './SkillTooltip'

import {filterSelector} from '../selectors'
import {learnMove} from '../actions'

const mapStateToProps = state => {
    return {
        filter: filterSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        learnMove: (skill, move) => dispatch(learnMove(skill, move))
    }
}

const SkillMoves = props => {
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

        let tooltip = (
            <SkillTooltip
                moveData={move}
                comparisonData={skillData.getIn(['moves', moveIndex], move)}
            />
        )

        let hm = null
        skillData.get('moves', List()).forEach((hmMove, j) => {
            if (hmMove.get('move') === moveNumber + 3) {
                let hmTooltip = (
                    <SkillTooltip
                        moveData={hmMove}
                        comparisonData={skillData.getIn(['moves', moveIndex], hmMove)}
                    />
                )
                if (currentMove === moveNumber + 3) {
                    tooltip = hmTooltip
                    moveIndex = j
                    type = hmMove.get('type', 'BASIC')
                }
                hm = (
                    <Tooltip
                        placement="bottomLeft"
                        title={hmTooltip}
                        align={{overflow: {adjustY: false, adjustX: true}}}
                        overlayClassName="skill-tooltip-wrap"
                        trigger={['hover', 'click']}>
                        <div
                            className={`hmButton ${currentMove === moveNumber + 3 ? 'active' : ''}`}
                            onClick={() =>
                                learnMove(
                                    skillId,
                                    currentMove === moveNumber + 3 ? moveNumber : moveNumber + 3
                                )}
                        />
                    </Tooltip>
                )
                return false
            }
        })

        moves.push(
            <div
                key={moveNumber}
                className={`skill-move-wrapper ${move.get('filter', List()).includes(filter)
                    ? 'filtered'
                    : ''}`}>
                <Tooltip
                    placement="bottomLeft"
                    title={tooltip}
                    align={{overflow: {adjustY: false, adjustX: true}}}
                    overlayClassName="skill-tooltip-wrap"
                    trigger={['hover', 'click']}>
                    <div
                        className={`skill-move ${currentMove === moveNumber ||
                        currentMove === moveNumber + 3
                            ? 'current'
                            : ''}`}
                        onClick={() =>
                            learnMove(
                                skillId,
                                currentMove === moveNumber + 3 ? moveNumber + 3 : moveNumber
                            )}>
                        <h6>{t(type)}</h6>
                        <img src={typeImages[types[type]]} alt={types[type]} className="typeImg" />
                    </div>
                </Tooltip>
                {hm}
            </div>
        )
    })

    let hotkeyImg =
        skillData.get('hotkey') !== 'None' ? (
            <img
                className="skill-hotkey"
                alt={skillData.get('hotkey')}
                src={keyImages[skillData.get('hotkey')]}
            />
        ) : null

    return (
        <div className="skill-moves-item">
            <h4 className="skill-name">
                {skillData.getIn(['moves', moveIndex, 'name'])}
                {hotkeyImg}
            </h4>
            <div className={`skill-moves ${moves.length === 1 ? 'single' : ''}`}>{moves}</div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('classes')(SkillMoves))
