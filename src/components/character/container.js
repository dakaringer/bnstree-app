import React from 'react'
import {Map} from 'immutable'

import CharacterNav from './components/CharacterNav'
import CharacterProfile from './components/CharacterProfile'
import CharacterStats from './components/CharacterStats'
//import CharacterEquips from './components/CharacterEquips'
import CharacterTabBar from './components/CharacterTabBar'
import CharacterSkill from './components/CharacterSkill'

import {Row, Col} from 'antd'

import {connect} from 'react-redux'
import {uiTextSelector, characterSelector, tabSelector} from './selector'
import {currentLanguageSelector, loadingSelector} from '../../selector'

import {loadCharacter, loadTextData} from './actions'

import Loading from '../shared/components/loading/container'

import './styles/character.scss'

const mapStateToProps = (state) => {
    return {
        currentLanguage: currentLanguageSelector(state),
        loading: loadingSelector(state),
        uiText: uiTextSelector(state).get('CHARACTER_PROFILE', Map()),
        character: characterSelector(state),
        currentTab: tabSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadText: (lang) => dispatch(loadTextData(lang)),
        loadCharacter: (region, name) => dispatch(loadCharacter(region, name))
    }
}

class Character extends React.Component {
    componentWillMount() {
        this.props.loadText(this.props.currentLanguage)
        let name = this.props.match.params.name
        if (!name) {
            let params = new URLSearchParams(this.props.location.search)
            name = params.get('c')
        }
        this.props.loadCharacter(this.props.match.params.region, name)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.region != this.props.match.params.region || nextProps.match.params.name != this.props.match.params.name) {
            let name = nextProps.match.params.name
            if (!name) {
                let params = new URLSearchParams(this.props.location.search)
                name = params.get('c')
            }
            this.props.loadCharacter(nextProps.match.params.region, name)
        }
        if (nextProps.currentLanguage != this.props.currentLanguage) {
            this.props.loadText(nextProps.currentLanguage)
        }
    }
    componentDidMount() {
        document.title = 'Character Search | BnSTree'
    }
    render() {
        let container = null
        if (this.props.loading) {
            container = <Loading/>
        }
        else if (this.props.character.get('general', Map()).equals(Map())) {
            container = <div className='loadingContainer'>
                <h3>{!this.props.match.params.name ? this.props.uiText.get('searchCharacter') : this.props.uiText.get('noCharacter')}</h3>
            </div>
        }
        else {
            //<CharacterEquips/>
            let innerContainer =
                <Row>
                    <Col sm={16}>
                        <CharacterStats/>
                    </Col>
                    <Col sm={8}>
                        <p className='equipError'>
                            Character Equipment is temporarily disabled due to NC disabling their API.
                            A work around is in progress.
                        </p>
                    </Col>
                </Row>
            if (this.props.currentTab == 'skills') {
                innerContainer = <CharacterSkill/>
            }

            container =
                <div className='mainContainer'>
                    <Row>
                        <Col sm={4} className='sideBarContainer'>
                            <CharacterProfile/>
                        </Col>
                        <Col sm={20}>
                            <CharacterTabBar/>
                            {innerContainer}
                        </Col>
                    </Row>
                </div>
        }

        return (
            <div className='character'>
                <CharacterNav/>
                {container}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Character)
