import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'

import './styles/News.scss'

import AdSense from '../AdSense/AdSense'
import Header from './components/NewsHeader'
import NewsList from './components/NewsList'
import NewsViewer from './components/NewsViewer'
import NewsEditor from './components/NewsEditor'

import {userSelector} from '../../selectors'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

const News = props => {
    const {t, user} = props

    let editArticle =
        user && user.get('admin', false) ? (
            <Route exact path="/news/edit/:id" component={NewsEditor} />
        ) : (
            <Redirect exact from="/news/edit/:id" to="/news" />
        )

    let newArticle =
        user && user.get('admin', false) ? (
            <Route exact path="/news/new" component={NewsEditor} />
        ) : (
            <Redirect exact from="/news/new" to="/news" />
        )

    return (
        <div className="news">
            <Helmet>
                <title>{`${t('news')} | BnSTree`}</title>
            </Helmet>

            <AdSense
                data-ad-client="ca-pub-2048637692232915"
                data-ad-slot="6768736382"
                data-ad-format="auto"
            />
            <div className="container">
                <Header />
                <div className="main-container">
                    <Switch>
                        <Route exact path="/news" render={() => <NewsList />} />
                        {newArticle}
                        {editArticle}
                        <Route path="/news/:id" component={NewsViewer} />
                    </Switch>
                    <AdSense
                        data-ad-client="ca-pub-2048637692232915"
                        data-ad-slot="2719129989"
                        data-ad-format="auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(News))
