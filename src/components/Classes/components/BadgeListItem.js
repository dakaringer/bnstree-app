import React from 'react'
import {connect} from 'react-redux'
import {Map, List, fromJS} from 'immutable'
import parser from '../parser'

import elementImages from '../images/map_elementImg'

import {
    skillNamesSelector,
    elementDataSelector,
    classSelector,
    badgeVoteDataSelector,
    userBadgeVoteDataSelector
} from '../selectors'

import {Collapse, Button, Icon} from 'antd'
const Panel = Collapse.Panel

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelector(state),
        elements: elementDataSelector(state),
        classCode: classSelector(state),
        voteData: badgeVoteDataSelector(state),
        userVoteData: userBadgeVoteDataSelector(state)
    }
}

class SkillListItem extends React.Component {
    constructor(props) {
        super(props)

        let state = {}
        props.elements.forEach(e => {
            let element = e.get('element')
            state[element] = 0
        })

        this.state = state
    }

    vote(element, voted) {
        let {badgeId, classCode} = this.props

        if (!voted) {
            let state = this.state
            state[element] = state[element] + 1
            this.setState(state)
        }

        fetch('https://api.bnstree.com/items/vote', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({
                item: badgeId,
                element: element,
                classCode: classCode
            })
        })
            .then(response => response.json())
            .then(json => {})
    }

    unvote(element, voted) {
        let {badgeId, classCode} = this.props

        if (voted) {
            let state = this.state
            state[element] = state[element] - 1
            this.setState(state)
        }

        fetch('https://api.bnstree.com/items/unvote', {
            method: 'delete',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({
                item: badgeId,
                element: element,
                classCode: classCode
            })
        })
            .then(response => response.json())
            .then(json => {})
    }

    render() {
        const {badge, badgeId, voteData, userVoteData, skillNames, elements} = this.props

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

        let voteCounts = voteData.getIn([badgeId, 'count'], Map())
        let votes = []
        let voteButtons = []
        elements.forEach(e => {
            let element = e.get('element')

            let userVote = userVoteData.find(
                v => v.get('item') === badgeId && v.get('element') === element
            )

            let voted = (userVote && this.state[element] === 0) || this.state[element] > 0

            votes.push(
                <span key={element} className="badge-vote-element">
                    <img alt={element} src={elementImages[element]} />{' '}
                    {voteCounts.get(element, 0) + this.state[element]}
                </span>
            )

            voteButtons.push(
                <span key={element} className="badge-vote-button">
                    <img alt={element} src={elementImages[element]} />
                    <Button
                        type="primary"
                        size="small"
                        ghost={!voted}
                        onClick={
                            voted
                                ? () => this.unvote(element, voted)
                                : () => this.vote(element, voted)
                        }>
                        <Icon type="arrow-up" />
                    </Button>
                </span>
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
                                        'icon',
                                        'blank'
                                    )}`}
                                />
                                <div>
                                    <h3 className={`grade_${badge.get('grade')}`}>
                                        {badge.get('name')}
                                    </h3>
                                    <div className="badge-votes">
                                        {votes}
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="badge-enhance">
                            {enhance}
                        </div>
                        <div className="badge-attributes">
                            {attributes}
                        </div>
                        <hr />
                        <div className="badge-vote-buttons">
                            {voteButtons}
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SkillListItem)
