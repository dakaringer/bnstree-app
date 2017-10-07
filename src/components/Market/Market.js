import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import {Row, Col} from 'antd'

import AdSense from '../AdSense/AdSense'

import './styles/Market.scss'

import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/MarketHeader'
import MarketSearch from './components/MarketSearch'
import MarketItemViewer from './components/MarketItemViewer'
import MarketBookmarkList from './components/MarketBookmarkList'

import {loadingSelector} from '../../selectors'
import {getRegion} from './actions'

const mapStateToProps = state => {
    return {
        loading: loadingSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getRegion: () => dispatch(getRegion())
    }
}

class Market extends React.PureComponent {
    componentDidMount() {
        this.props.getRegion()
    }

    render() {
        const {t, loading} = this.props

        let content = <LoadingLyn />
        if (!loading) {
            content = (
                <div>
                    <div className="main-container">
                        <Row gutter={10}>
                            <Col md={6}>
                                <MarketSearch />
                                <MarketBookmarkList />
                            </Col>
                            <Col md={18}>
                                <MarketItemViewer />
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
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header />
                    {content}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Market))
