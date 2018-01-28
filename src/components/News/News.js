import React from 'react'
import { translate } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { animateScroll } from 'react-scroll'
import Fade from 'react-reveal/Fade'

import './styles/News.scss'

import AdSense from '../AdSense/AdSense'
import Header from './components/NewsHeader'
import NewsList from './components/NewsList'
import NewsViewer from './components/NewsViewer'

class News extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        const { t } = this.props

        return (
            <div className="news">
                <Helmet>
                    <title>{`${t('news')} | BnSTree`}</title>
                    <meta name="description" content="Latest news on Blade & Soul!" />
                </Helmet>

                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <Fade>
                    <div className="container">
                        <Header />
                        <div className="main-container">
                            <Switch>
                                <Route exact path="/news" render={() => <NewsList />} />
                                <Route path="/news/:id" component={NewsViewer} />
                            </Switch>
                            <AdSense
                                data-ad-client="ca-pub-2048637692232915"
                                data-ad-slot="2719129989"
                                data-ad-format="auto"
                            />
                        </div>
                    </div>
                </Fade>
            </div>
        )
    }
}

export default translate('general')(News)
