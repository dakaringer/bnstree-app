import React, {Component} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {loadCharacter} from '../actions'
import {loadingSelector} from '../../../selectors'
import {characterSelector} from '../selectors'
import {characterElementSelector} from '../../Skills/selectors'

import LoadingLyn from '../../LoadingLyn/LoadingLyn'
import CharacterProfile from './CharacterProfile'
import CharacterStats from './CharacterStats'
import CharacterEquips from './CharacterEquips'

import SkillList from '../../Skills/components/SkillList'

import '../../Skills/styles/Skills.scss'
import elementImages from '../../Skills/images/map_elementImg'

import {Row, Col, Tabs} from 'antd'
const TabPane = Tabs.TabPane

const mapStateToProps = state => {
    return {
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

class CharacterViewer extends Component {
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
    }

    render() {
        const {t, character, characterElement, loading} = this.props

        let content = <LoadingLyn />
        if (!loading) {
            if (character.has('general')) {
                content = (
                    <Row className="character-content" gutter={16}>
                        <Col sm={4} className="profile-container">
                            <CharacterProfile />
                        </Col>
                        <Col sm={20} className="stats-container">
                            <Tabs defaultActiveKey="1" animated>
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
                        <p>
                            {t('noCharacter')}
                        </p>
                    </div>
                )
            }
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('character')(CharacterViewer))
