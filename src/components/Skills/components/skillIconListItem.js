import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {Tooltip, Popover} from 'antd'

import SkillMoves from './SkillMoves'
import SkillTooltip from './SkillTooltip'

import {filterSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        filter: filterSelector(state)
    }
}

const SkillIconListItem = props => {
    const {skillData, skillId} = props

    let offset = skillData.getIn(['moves', 0, 'move'], 1) - 1

    let currentMove = skillData.get('currentMove', 1)
    let moveIndex = 0
    skillData.get('moves', List()).forEach((m, i) => {
        if (m.get('move', 1) === currentMove + offset) {
            moveIndex = i
            return false
        }
    })

    let mainTooltip = (
        <SkillTooltip
            moveData={skillData.getIn(['moves', moveIndex])}
            comparisonData={skillData.getIn(['moves', moveIndex])}
        />
    )

    return (
        <div className="skill-icon-list-item">
            <Tooltip
                placement="bottomLeft"
                title={mainTooltip}
                align={{overflow: {adjustY: false, adjustX: true}}}
                overlayClassName="skill-tooltip-wrap">
                <Popover
                    placement="topLeft"
                    trigger="click"
                    align={{overflow: {adjustY: false, adjustX: true}}}
                    content={<SkillMoves skillData={skillData} skillId={skillId} />}>
                    <img
                        className="skill-icon"
                        alt={skillId}
                        src={`https://static.bnstree.com/images/skill/${skillData.getIn([
                            'moves',
                            moveIndex,
                            'icon'
                        ])}`}
                    />
                </Popover>
            </Tooltip>
        </div>
    )
}

export default connect(mapStateToProps)(SkillIconListItem)
