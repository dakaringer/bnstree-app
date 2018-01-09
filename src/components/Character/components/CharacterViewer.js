import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import {loadCharacter, vote} from '../actions'
import {loadingSelector, userSelector} from '../../../selectors'
import {characterSelector} from '../selectors'
import {characterElementSelector} from '../../Skills/selectors'

import LoadingLyn from '../../LoadingLyn/LoadingLyn'
import CharacterProfile from './CharacterProfile'
import CharacterStats from './CharacterStats'
import CharacterEquips from './CharacterEquips'

import SkillList from '../../Skills/components/SkillList'

import '../../Skills/styles/Skills.scss'
import elementImages from '../../Skills/images/map_elementImg'

import {Row, Col, Tabs, Icon} from 'antd'
const TabPane = Tabs.TabPane

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        loading: loadingSelector(state),
        character: characterSelector(state),
        characterElement: characterElementSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadCharacter: (region, name) => dispatch(loadCharacter(region, name))
    }
}

class CharacterViewer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            voted: false
        }
    }

    componentWillMount() {
        const {match, loadCharacter} = this.props
        loadCharacter(match.params.region, match.params.character)
    }
    componentWillReceiveProps(nextProps) {
        const {match, loadCharacter} = this.props

        if (
            nextProps.match.params.character !== match.params.character ||
            nextProps.match.params.region !== match.params.region
        ) {
            loadCharacter(nextProps.match.params.region, nextProps.match.params.character)
        }

        this.setState({
            voted: nextProps.character.get('userVoted', false)
        })
    }

    vote() {
        let {character} = this.props

        vote(
            character.getIn(['general', 'region']),
            character.getIn(['general', 'name']),
            !this.state.voted
        )

        this.setState({
            voted: !this.state.voted
        })
    }

    render() {
        const {t, user, character, characterElement, loading} = this.props
        const {voted} = this.state

        let likeButton = user ? (
            <a onClick={() => this.vote(voted)}>
                {voted ? <Icon type="heart" /> : <Icon type="heart-o" />}
            </a>
        ) : (
            <Icon type="heart-o" />
        )
        let like = (
            <div className="like">
                {likeButton}
                <span className="like-count">
                    {character.get('characterVotes', 0) +
                        (character.get('userVoted', false) ? -1 : 0) +
                        (this.state.voted ? 1 : 0)}
                </span>
            </div>
        )

        let exists = character.get('general') && !character.getIn(['general', 'notFound'], false)

        let content = <LoadingLyn />
        if (!loading) {
            if (exists) {
                content = (
                    <Row className="character-content" gutter={16}>
                        <Col lg={4} className="profile-container">
                            <CharacterProfile />
                        </Col>
                        <Col lg={20}>
                            <Tabs defaultActiveKey="info" animated tabBarExtraContent={like}>
                                <TabPane tab={t('info')} key="info">
                                    <Row className="character-info-large">
                                        <Col sm={16}>
                                            <div className="character-stats-container">
                                                <CharacterStats attack />
                                                <CharacterStats />
                                            </div>
                                        </Col>
                                        <Col sm={8}>
                                            <CharacterEquips />
                                        </Col>
                                    </Row>
                                    <Tabs
                                        defaultActiveKey="equip"
                                        animated
                                        className="character-info-small">
                                        <TabPane tab={t('equipment')} key="equip">
                                            <CharacterEquips />
                                        </TabPane>
                                        <TabPane tab={t('statAttack')} key="attack">
                                            <CharacterStats attack />
                                        </TabPane>
                                        <TabPane tab={t('statDefense')} key="defense">
                                            <CharacterStats />
                                        </TabPane>
                                    </Tabs>
                                </TabPane>
                                <TabPane tab={t('skills')} key="skills">
                                    <div className="character-build-element">
                                        <img
                                            alt={characterElement}
                                            src={elementImages[characterElement]}
                                        />
                                        {t(characterElement)}
                                    </div>
                                    <SkillList characterViewer />
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                )
            } else {
                let message = t('noCharacter')
                if (character.getIn(['general', 'nameChanged'], false)) {
                    message = t('nameChanged')
                }
                if (character.getIn(['general', 'unavailable'], false)) {
                    message = t('serverUnavailable')
                }

                content = (
                    <div className="character-not-found">
                        <p>{message}</p>
                    </div>
                )
            }
        }

        return (
            <div>
                <Helmet>
                    <title>{`${
                        exists ? character.getIn(['general', 'name']) : t('general:characterSearch')
                    } | BnSTree`}</title>
                </Helmet>
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['character', 'general'])(CharacterViewer)
)
