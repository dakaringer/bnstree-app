import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import {loadCharacter, vote} from '../actions'
import {loadingSelector, userSelector} from '../../../selectors'
import {characterSelector} from '../selectors'
import {characterElementSelector} from '../../Classes/selectors'

import LoadingLyn from '../../LoadingLyn/LoadingLyn'
import CharacterProfile from './CharacterProfile'
import CharacterStats from './CharacterStats'
import CharacterEquips from './CharacterEquips'

import SkillList from '../../Classes/components/SkillList'

import '../../Classes/styles/Classes.scss'
import elementImages from '../../Classes/images/map_elementImg'

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

        let content = <LoadingLyn />
        if (!loading) {
            if (character.get('general')) {
                content = (
                    <Row className="character-content" gutter={16}>
                        <Col lg={4} className="profile-container">
                            <CharacterProfile />
                        </Col>
                        <Col lg={20} className="stats-container">
                            <Tabs defaultActiveKey="1" animated tabBarExtraContent={like}>
                                <TabPane tab={t('info')} key="1">
                                    <Row>
                                        <Col sm={16}>
                                            <CharacterStats />
                                        </Col>
                                        <Col sm={8}>
                                            <CharacterEquips />
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab={t('skills')} key="2">
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
                content = (
                    <div className="character-not-found">
                        <p>{t('noCharacter')}</p>
                    </div>
                )
            }
        }

        return (
            <div>
                <Helmet>
                    <title>{`${character.has('general')
                        ? character.getIn(['general', 'name'])
                        : t('general:characterSearch')} | BnSTree`}</title>
                </Helmet>
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['character', 'general'])(CharacterViewer)
)
