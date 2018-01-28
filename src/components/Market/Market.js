import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import Fade from 'react-reveal/Fade'

import { Row, Col } from 'antd'

import AdSense from '../AdSense/AdSense'

import './styles/Market.scss'

import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/MarketHeader'
import MarketSearch from './components/MarketSearch'
import MarketItemViewer from './components/MarketItemViewer'
import MarketBookmarkList from './components/MarketBookmarkList'
import MarketPopularItemList from './components/MarketPopularItemList'

import { loadingSelector } from '../../selectors'

const mapStateToProps = state => {
    return {
        loading: loadingSelector(state)
    }
}

class Market extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        const { t, loading, history } = this.props

        let content = <LoadingLyn />
        if (!loading) {
            content = (
                <div>
                    <div className="main-container">
                        <Row gutter={10}>
                            <Col md={6}>
                                <MarketSearch history={history} />
                                <MarketBookmarkList />
                            </Col>
                            <Col md={18}>
                                <Switch>
                                    <Route
                                        exact
                                        path={'/market/:region/:itemId'}
                                        component={MarketItemViewer}
                                    />
                                    <Route component={MarketPopularItemList} />
                                </Switch>
                            </Col>
                        </Row>
                    </div>
                    <div className="slim-container">
                        <AdSense
                            data-ad-client="ca-pub-2048637692232915"
                            data-ad-slot="2719129989"
                            data-ad-format="auto"
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className="market">
                <Helmet>
                    <title>{`${t('market')} | BnSTree`}</title>
                    <meta
                        name="description"
                        content="Blade & Soul marketplace search for NA and EU servers."
                    />
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <Fade>
                    <div className="container">
                        <Header />
                        {content}
                    </div>
                </Fade>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('general')(Market))
