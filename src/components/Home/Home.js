import React from 'react'
import {translate} from 'react-i18next'
import {Link} from 'react-router-dom'
import {Helmet} from 'react-helmet'

import {Row, Col, Button} from 'antd'

import AdSense from '../AdSense/AdSense'

import './styles/Home.scss'
import discordLogo from './images/discord.png'

import CharacterSearch from '../Character/components/CharacterSearch'
import HomeClassLinks from './components/HomeClassLinks'
import HomeNewsList from './components/HomeNewsList'
import HomeCharacter from './components/HomeCharacter'
import StreamList from '../Streams/components/StreamList'

const Home = props => {
    let {t} = props
    return (
        <div className="home">
            <Helmet>
                <title>BnSTree</title>
            </Helmet>
            <div className="home-top">
                <HomeClassLinks />
                <CharacterSearch center />
                <HomeCharacter />
            </div>
            <div className="home-bottom">
                <div className="home-container container">
                    <HomeNewsList />
                    <AdSense
                        data-ad-client="ca-pub-2048637692232915"
                        data-ad-slot="6768736382"
                        data-ad-format="auto"
                    />
                    <Row className="stream-menu-container">
                        <Col md={16} className="home-stream">
                            <h3>
                                {t('streams')}
                                <small>
                                    <Link to="/streams" className="more">
                                        {t('moreStreams')}
                                    </Link>
                                </small>
                            </h3>
                            <StreamList limit={4} />
                        </Col>
                        <Col md={8} className="side-menu">
                            <div>
                                <a
                                    href="https://discord.gg/2ZdtPZM"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Button type="primary" className="side-button discord">
                                        <img alt="discord" src={discordLogo} />
                                        BnSTree Discord
                                    </Button>
                                </a>
                                <a
                                    href="https://discord.gg/TUFzGba"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Button type="primary" className="side-button discord raid">
                                        <img alt="discord" src={discordLogo} />
                                        Raid Recruitment Discord
                                    </Button>
                                </a>
                                <AdSense
                                    data-ad-format="fluid"
                                    data-ad-layout="image-top"
                                    data-ad-layout-key="-8c+2n-ep+50+yc"
                                    data-ad-client="ca-pub-2048637692232915"
                                    data-ad-slot="5100203858"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default translate('general')(Home)
