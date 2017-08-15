import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List, fromJS} from 'immutable'
import parser from '../parser'

import elementImages from '../images/map_elementImg'

import {userSelector} from '../../../selectors'
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
        user: userSelector(state),
        skillNames: skillNamesSelector(state),
        elements: elementDataSelector(state),
        classCode: classSelector(state),
        voteData: badgeVoteDataSelector(state),
        userVoteData: userBadgeVoteDataSelector(state)
    }
}

class BadgeListItem extends React.Component {
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
        let {itemId, classCode} = this.props

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
                item: itemId,
                element: element,
                classCode: classCode
            })
        })
            .then(response => response.json())
            .then(json => {})
    }

    unvote(element, voted) {
        let {itemId, classCode} = this.props

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
                item: itemId,
                element: element,
                classCode: classCode
            })
        })
            .then(response => response.json())
            .then(json => {})
    }

    render() {
        const {t, user, badge, itemId, voteData, userVoteData, skillNames, elements} = this.props

        let skill = badge.get('enhance', List())

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

        let voteCounts = voteData.getIn([itemId, 'count'], Map())
        let votes = []
        let voteButtons = []
        elements.forEach(e => {
            let element = e.get('element')

            let userVote = userVoteData
                ? userVoteData.find(v => v.get('item') === itemId && v.get('element') === element)
                : null

            let voted = (userVote && this.state[element] === 0) || this.state[element] > 0

            votes.push(
                <span key={element} className="item-vote-element">
                    <img alt={element} src={elementImages[element]} />{' '}
                    {voteCounts.get(element, 0) + this.state[element]}
                </span>
            )

            voteButtons.push(
                <span key={element} className="item-vote-button">
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

        let combine = null
        if (badge.has('combine')) {
            let mix = []
            badge.get('combine', List()).forEach(b => {
                mix.push(
                    ' + ',
                    <span className="grade_5" key={b.get('name')}>
                        <img
                            alt={b.get('name')}
                            src={`https://static.bnstree.com/images/badges/${b.get(
                                'icon',
                                'blank'
                            )}`}
                        />
                        {b.get('name')}
                    </span>
                )
            })

            combine = (
                <div className="badge-combine">
                    <hr />
                    <label>{t('combine')}:</label> {mix.slice(1)}
                </div>
            )
        }

        return (
            <div className="item-list-item">
                <Collapse bordered={false}>
                    <Panel
                        header={
                            <div className="item-header">
                                <img
                                    className="item-icon"
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
                                    <div className="item-votes">
                                        {votes}
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="badge-enhance">
                            {enhance}
                        </div>
                        <div className="item-attributes">
                            {attributes}
                        </div>
                        {combine}
                        {user
                            ? <div className="item-vote-buttons">
                                  <hr />
                                  {voteButtons}
                              </div>
                            : null}
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('skills')(BadgeListItem))
