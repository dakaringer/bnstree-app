import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {Tooltip} from 'antd'

import SkillMoves from './SkillMoves'
import SkillTooltip from './SkillTooltip'

import {filterSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        filter: filterSelector(state)
    }
}

const SkillListItem = props => {
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
        <div className="skill-list-item">
            <Tooltip
                placement="bottomLeft"
                title={mainTooltip}
                align={{overflow: {adjustY: false, adjustX: true}}}
                overlayClassName="skill-tooltip-wrap">
                <img
                    className="skill-icon"
                    alt={skillId}
                    src={`https://static.bnstree.com/images/skill/${skillData.getIn(
                        ['moves', moveIndex, 'icon'],
                        'skill_icon_forcemaster_1_33'
                    )}`}
                />
            </Tooltip>
            <SkillMoves skillData={skillData} skillId={skillId} />
        </div>
    )
}

export default connect(mapStateToProps)(SkillListItem)
