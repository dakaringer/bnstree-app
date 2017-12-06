import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List, fromJS} from 'immutable'
import {Button, Icon} from 'antd'

import {userSelector} from '../../../selectors'
import {skillNamesSelector, userVoteDataSelector} from '../selectors'
import {vote} from '../actions'
import parser from '../../Skills/parser'

import elementImages from '../images/map_elementImg2'

const classElements = {
    BM: ['flame', 'lightning'],
    KF: ['wind', 'flame'],
    DE: ['earth', 'shadow'],
    FM: ['flame', 'frost'],
    AS: ['shadow', 'lightning'],
    SU: ['wind', 'earth'],
    BD: ['wind', 'lightning'],
    WL: ['frost', 'shadow'],
    SF: ['earth', 'frost'],
    SH: ['flame', 'shadow']
}

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelector(state),
        userVoteData: userVoteDataSelector(state),
        user: userSelector(state)
    }
}

class BadgeContent extends React.PureComponent {
    constructor(props) {
        super(props)

        let state = {}
        let classCode = props.item.get('classCode')
        classElements[classCode].forEach(element => {
            state[element] = false
        })

        this.state = state
    }

    componentWillMount() {
        const {userVoteData, item, itemId} = this.props

        let state = {}
        let classCode = item.get('classCode')
        classElements[classCode].forEach(element => {
            let userVote = userVoteData
                ? userVoteData.getIn([itemId, 'count', element], null)
                : null

            if (userVote) {
                state[element] = true
            }
        })

        this.setState(state)
    }

    handleVote(element) {
        let {item, itemId} = this.props
        let classCode = item.get('classCode')

        let state = this.state[element]

        vote(itemId, element, classCode, !state)

        let newState = {}
        newState[element] = !state
        this.setState(newState)
    }

    render() {
        const {t, item, itemId, skillNames, userVoteData, user} = this.props

        let skill = item.get('enhance', List())

        let enhance = []
        if (List.isList(skill)) {
            skill.forEach((s, i) => {
                enhance.push(
                    <p className="attribute" key={i}>
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
        item.get('attributes', List()).forEach((attb, i) => {
            attributes.push(
                <p className="attribute" key={i}>
                    {parser(attb, null, null, skillNames)}
                </p>
            )
        })

        let extra = []
        if (item.has('combine')) {
            let mix = []
            item.get('combine', List()).forEach(b => {
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

            extra.push(
                <p key="combine" className="badge-combine">
                    <label>{t('combine')}:</label> {mix.slice(1)}
                </p>
            )
        }

        if (item.get('classCode', 'ALL') !== 'ALL') {
            extra.push(
                <p key="class-restriction">
                    {t('classRestriction', {className: t(item.get('classCode'))})}
                </p>
            )
        }

        let voteCounts = item.get('voteData', Map())
        let votes = []
        let classCode = item.get('classCode')
        classElements[classCode].forEach(element => {
            let userVote = userVoteData
                ? userVoteData.getIn([itemId, 'count', element], null)
                : null

            let voted = this.state[element]

            votes.push(
                <span key={element} className="item-vote-group">
                    <img alt={element} src={elementImages[element]} />
                    {voteCounts.get(element, 0) +
                        (userVote ? -1 : 0) +
                        (this.state[element] ? 1 : 0)}
                    {user ? (
                        <Button
                            type="primary"
                            size="small"
                            ghost={!voted}
                            onClick={() => this.handleVote(element)}>
                            <Icon type="arrow-up" />
                        </Button>
                    ) : null}
                </span>
            )
        })

        return (
            <div className="item-content">
                <div className="item-main">{enhance}</div>
                <div className="item-attributes">{attributes}</div>
                {extra.length > 0 ? (
                    <div className="extra">
                        <hr />
                        {extra}
                    </div>
                ) : null}
                <div className="item-vote">
                    <hr />
                    <span>{t('recommend')}:</span> {votes}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('items')(BadgeContent))
