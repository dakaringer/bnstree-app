import React from 'react'
import {connect} from 'react-redux'
import {List, fromJS} from 'immutable'
import parser from '../parser'

import {skillNamesSelector} from '../selectors'

import {Collapse} from 'antd'
const Panel = Collapse.Panel

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelector(state)
    }
}

const SkillListItem = props => {
    const {badge, skillNames} = props

    //let tooltip = <BadgeTooltip badge={badge} />
    let skill = badge.get('enhance')

    let enhance = []
    if (List.isList(skill)) {
        skill.forEach(s => {
            enhance.push(
                <p className="attribute" key={s}>
                    {parser(fromJS(['enhanceSkill', {skill: s}]), null, null, skillNames)}
                </p>
            )
        })
    } else {
        enhance.push(
            <p className="attribute" key={skill}>
                {parser(fromJS(['enhanceSkill', {skill: skill}]), null, null, skillNames)}
            </p>
        )
    }

    let attributes = []
    badge.get('attributes', List()).forEach((attb, i) => {
        attributes.push(
            <p className="attribute" key={i}>
                {parser(attb, null, null, skillNames)}
            </p>
        )
    })

    return (
        <div className="badge-list-item">
            <Collapse bordered={false}>
                <Panel
                    header={
                        <div className="badge-header">
                            <img
                                className="badge-icon"
                                alt={badge.get('name')}
                                src={`https://static.bnstree.com/images/badges/${badge.get(
                                    'icon'
                                )}`}
                            />
                            <h3 className={`grade_${badge.get('grade')}`}>
                                {badge.get('name')}
                            </h3>
                        </div>
                    }>
                    <div className="badge-enhance">
                        {enhance}
                    </div>
                    <div className="badge-attributes">
                        {attributes}
                    </div>
                </Panel>
            </Collapse>
        </div>
    )
}

export default connect(mapStateToProps)(SkillListItem)
