import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {Popover} from 'antd'

import SkillMoves from './SkillMoves'

import {filterSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        filter: filterSelector(state)
    }
}

const SkillGridItem = props => {
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

    return (
        <div className="skill-grid-item">
            <Popover
                placement="bottomLeft"
                align={{overflow: {adjustY: false, adjustX: true}}}
                overlayClassName="skill-icon-popover-wrap"
                content={<SkillMoves skillData={skillData} skillId={skillId} />}
                trigger={['hover', 'click']}>
                <img
                    className="skill-icon"
                    alt={skillId}
                    src={`https://static.bnstree.com/images/skills/${skillData.getIn(
                        ['moves', moveIndex, 'icon'],
                        'blank'
                    )}`}
                />
            </Popover>
        </div>
    )
}

export default connect(mapStateToProps)(SkillGridItem)
