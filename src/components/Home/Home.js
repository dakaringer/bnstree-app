import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {Link} from 'react-router-dom'

import {Row, Col, Button} from 'antd'

import './styles/Home.scss'
import discordLogo from './images/discord.png'

import CharacterSearch from '../Character/components/CharacterSearch'
import HomeClassLinks from './components/HomeClassLinks'
import HomeNewsList from './components/HomeNewsList'
import HomeCharacter from './components/HomeCharacter'
import StreamList from '../Streams/components/StreamList'

class Home extends Component {
    componentDidMount() {
        document.title = 'BnSTree'
    }

    render() {
        let {t} = this.props
        return (
            <div className="home">
                <div className="home-top">
                    <HomeClassLinks />
                    <CharacterSearch center />
                    <HomeCharacter />
                </div>
                <div className="home-bottom">
                    <HomeNewsList />
                    <div className="slim-container container">
                        <Row>
                            <Col md={16} className="home-stream">
                                <h4>
                                    {t('streams')}
                                </h4>
                                <StreamList limit={4} />
                                <Link to="/streams" className="more">
                                    {t('moreStreams')}
                                </Link>
                            </Col>
                            <Col md={8} className="side-menu">
                                <a
                                    href="https://discord.gg/2ZdtPZM"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Button type="primary" className="side-button discord">
                                        <img alt="discord" src={discordLogo} />
                                        BnSTree Discord
                                    </Button>
                                </a>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default translate('general')(Home)
