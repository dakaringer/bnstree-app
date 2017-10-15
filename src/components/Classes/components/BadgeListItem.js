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
import {vote} from '../actions'

import {Collapse, Button, Icon} from 'antd'
const Panel = Collapse.Panel

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

class BadgeListItem extends React.PureComponent {
    constructor(props) {
        super(props)

        let state = {}
        props.elements.forEach(e => {
            let element = e.get('element')
            state[element] = false
        })

        this.state = state
    }

    componentWillMount() {
        const {userVoteData, itemId, elements} = this.props

        let state = {}
        elements.forEach(e => {
            let element = e.get('element')

            let userVote = userVoteData
                ? userVoteData.find(v => v.get('item') === itemId && v.get('element') === element)
                : null

            if (userVote) {
                state[element] = true
            }
        })

        this.setState(state)
    }

    vote(element) {
        let {itemId, classCode} = this.props
        let state = this.state[element]

        vote(itemId, element, classCode, !state)

        let newState = {}
        newState[element] = !state
        this.setState(newState)
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

            let voted = this.state[element]

            votes.push(
                <span key={element} className="item-vote-element">
                    <img alt={element} src={elementImages[element]} />{' '}
                    {voteCounts.get(element, 0) +
                        (userVote ? -1 : 0) +
                        (this.state[element] ? 1 : 0)}
                </span>
            )

            voteButtons.push(
                <span key={element} className="item-vote-button">
                    <img alt={element} src={elementImages[element]} />
                    <Button
                        type="primary"
                        size="small"
                        ghost={!voted}
                        onClick={() => this.vote(element)}>
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
                                    <div className="item-votes">{votes}</div>
                                </div>
                            </div>
                        }>
                        <div className="badge-enhance">{enhance}</div>
                        <div className="item-attributes">{attributes}</div>
                        {combine}
                        {user ? (
                            <div className="item-vote-buttons">
                                <hr />
                                {voteButtons}
                            </div>
                        ) : null}
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('classes')(BadgeListItem))
