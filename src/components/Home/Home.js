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
import MarketList from '../Market/components/MarketPopularItemList'

const Home = props => {
    let {t} = props
    return (
        <div className="home">
            <Helmet>
                <title>BnSTree</title>
            </Helmet>
            <div className="home-top">
                <div className="dummy-container" />
                <CharacterSearch center />
                <div className="home-ad-container">
                    <AdSense
                        style={{
                            display: 'inline-block',
                            width: '468px',
                            height: '60px'
                        }}
                        data-ad-client="ca-pub-2048637692232915"
                        data-ad-slot="1353092581"
                    />
                </div>
                <HomeCharacter />
                <HomeClassLinks />
            </div>
            <div className="home-bottom">
                <div className="home-container container">
                    <HomeNewsList />
                    <AdSense
                        data-ad-client="ca-pub-2048637692232915"
                        data-ad-slot="2719129989"
                        data-ad-format="auto"
                    />
                    <div className="home-market">
                        <h3>{t('market')}</h3>
                        <MarketList />
                    </div>
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
                            <h3>{t('links')}</h3>
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
