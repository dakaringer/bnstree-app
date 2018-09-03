import React from 'react'

import discordLogo from './images/discord.png'

import {Map} from 'immutable'
import {Radio} from 'antd'
const RadioGroup = Radio.Group

import AdSense from '../shared/adsense'

import {Row, Col, Button} from 'antd'

import moment from 'moment'

import {connect} from 'react-redux'
import {userSelector, uiTextSelector, currentLanguageSelector} from '../../selector'

import NavLink from '../shared/navLink'
import ClassLinks from '../shared/components/classLinks/container2'
import NewsCards from './components/NewsCards'
import BuildCards from './components/BuildCards'

import './styles/home.scss'

const mapStateToProps = (state) => {
    return {
        user: userSelector(state),
        locale: currentLanguageSelector(state),
        uiText: uiTextSelector(state).get('GENERAL_NAV', Map())
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            region: 'na',
            characterName: ''
        }
    }
    componentDidMount() {
        document.title = 'BnSTree'
    }

    changeRegion(e) {
        this.setState({region: e.target.value})
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    searchCharacter(e) {
        e.preventDefault()
        this.props.history.push(`/character/${this.state.region}/${this.state.characterName}`)
    }

    render() {
        moment.locale(this.props.locale)

        let adminButton = null
        if (this.props.user && this.props.user.get('admin', false)) {
            adminButton = <Button type='danger' className='sideButton'><a href='/edit'>Add article</a></Button>
        }

        return (
            <div className='home'>
                <Row>
                    <Col md={14} className='home-main'>
                        <div className='home-main-item'>
                            <h5>{this.props.uiText.get('characterSearch')}</h5>
                            <form className="characterSearch" onSubmit={(e) => this.searchCharacter(e)}>
                                <RadioGroup onChange={(e) => this.changeRegion(e)} value={this.state.region}>
                                    <Radio key="a" value={'na'}>NA</Radio>
                                    <Radio key="b" value={'eu'}>EU</Radio>
                                </RadioGroup>
                                <div className='inputGroup'>
                                    <input onChange={(e) => this.enterCharacter(e)} value={this.state.characterName} className="nameInput" placeholder={this.props.uiText.get('characterName')}/>
                                </div>
                            </form>
                        </div>
                        <div className='home-main-item'>
                            <h5>{this.props.uiText.get('skills')}</h5>
                            <ClassLinks/>
                        </div>
                    </Col>
                    <Col md={10} className='home-articles'>
                        <AdSense client="ca-pub-2048637692232915" slot="6768736382" format='auto'/>
                        <NewsCards/>
                        <NavLink className='viewAll' to='/news'>{this.props.uiText.get('archive')}</NavLink>
                        {adminButton}
                    </Col>
                </Row>
                <div className='sub-block'>
                    <Row gutter={50} className='home-content'>
                        <Col md={16} className='home-builds'>
                            <h2>{this.props.uiText.get('newBuilds')}</h2>
                            <BuildCards/>
                        </Col>
                        <Col md={8} className='home-sidemenu'>
                            <AdSense client="ca-pub-2048637692232915" slot="9888022383" format='auto'/>
                            <a href="https://discord.gg/2ZdtPZM"  target="_blank">
                                <Button type="primary" className='sideButton discord'>
                                    <img src={discordLogo} />
                                    BnSTree Discord
                                </Button>
                            </a>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Main)
