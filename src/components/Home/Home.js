import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Fade from 'react-reveal/Fade'

import { animateScroll } from 'react-scroll'

import { Row, Col, Button } from 'antd'

import AdSense from '../AdSense/AdSense'

import './styles/Home.scss'
import discordLogo from './images/discord.png'
import redditLogo from './images/reddit.png'
import bnsLogo from './images/bns.png'

import CharacterSearch from '../Character/components/CharacterSearch'
import HomeClassLinks from './components/HomeClassLinks'
import HomeNewsList from './components/HomeNewsList'
import HomeCharacter from './components/HomeCharacter'
import HomeTwitter from './components/HomeTwitter'
import StreamList from '../Streams/components/StreamList'
import MarketList from '../Market/components/MarketPopularItemList'

import { viewSelector } from '../../selectors'
import { updateRegion } from '../Market/actions'

import { Radio } from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        region: viewSelector(state).get('marketRegion', 'na')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: value => dispatch(updateRegion(value))
    }
}

class Home extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        const { t, region, match, history, setRegion } = this.props

        return (
            <div className="home">
                <Helmet>
                    <title>BnSTree</title>
                </Helmet>
                <HomeCharacter />
                <Fade duration={2000}>
                    <div className="home-top">
                        <div className="dummy-container" />
                        <CharacterSearch center match={match} history={history} />
                        <div className="home-ad-container">
                            <AdSense
                                data-ad-client="ca-pub-2048637692232915"
                                data-ad-slot="6768736382"
                                data-ad-format="auto"
                            />
                        </div>
                    </div>
                </Fade>
                <Fade delay={1000} duration={1500}>
                    <div className="home-bottom">
                        <HomeClassLinks />
                        <div className="home-container container">
                            <HomeNewsList />
                            <AdSense
                                data-ad-client="ca-pub-2048637692232915"
                                data-ad-slot="2719129989"
                                data-ad-format="auto"
                            />
                            <div className="home-market">
                                <h3>
                                    {t('market')}{' '}
                                    <span>
                                        <RadioGroup
                                            className="regionSelector"
                                            size="small"
                                            value={region}
                                            onChange={e => setRegion(e.target.value)}>
                                            <RadioButton value="na">NA</RadioButton>
                                            <RadioButton value="eu">EU</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </h3>
                                <MarketList />
                            </div>
                            <div className="section-container home-stream">
                                <h3>
                                    {t('streams')}
                                    <small>
                                        <Link to="/streams" className="more">
                                            {t('moreStreams')}
                                        </Link>
                                    </small>
                                </h3>
                                <StreamList limit={4} />
                            </div>
                            <div>
                                <Row className="section-container" gutter={32}>
                                    <Col sm={16}>
                                        <HomeTwitter />
                                    </Col>
                                    <Col sm={8} className="side-menu">
                                        <h3>{t('links')}</h3>
                                        <div>
                                            <a
                                                href="https://www.bladeandsoul.com"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button type="primary" className="side-button bns">
                                                    <img alt="bns" src={bnsLogo} />
                                                    B&S Official Site
                                                </Button>
                                            </a>
                                            <a
                                                href="https://www.reddit.com/r/bladeandsoul/"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button type="primary" className="side-button reddit">
                                                    <img alt="discord" src={redditLogo} />
                                                    B&S Subreddit
                                                </Button>
                                            </a>
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
                                                href="https://discord.gg/bnsrecruitment"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button
                                                    type="primary"
                                                    className="side-button discord raid">
                                                    <img alt="discord" src={discordLogo} />
                                                    Raid Recruitment Discord
                                                </Button>
                                            </a>
                                            <a
                                                href="https://discord.gg/zU8vTm4"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button
                                                    type="primary"
                                                    className="side-button discord academy">
                                                    <img alt="discord" src={discordLogo} />
                                                    BnS Academy Discord
                                                </Button>
                                            </a>
                                        </div>
                                        <AdSense
                                            data-ad-format="fluid"
                                            data-ad-layout="image-top"
                                            data-ad-layout-key="-8c+2n-ep+50+yc"
                                            data-ad-client="ca-pub-2048637692232915"
                                            data-ad-slot="5100203858"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Fade>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Home))
