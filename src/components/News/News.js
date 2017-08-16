import React from 'react'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'
import {Helmet} from 'react-helmet'

import './styles/News.scss'

import Header from './components/NewsHeader'
import NewsList from './components/NewsList'
import NewsViewer from './components/NewsViewer'
import NewsEditor from './components/NewsEditor'

const News = props => {
    const {t} = props
    return (
        <div className="character">
            <Helmet>
                <title>{`${t('news')} | BnSTree`}</title>
            </Helmet>
            <div className="container">
                <Header />
                <div className="main-container">
                    <Switch>
                        <Route exact path={'/news'} render={() => <NewsList ad />} />
                        <Route exact path={'/news/new'} component={NewsEditor} />
                        <Route exact path={'/news/edit/:id'} component={NewsEditor} />
                        <Route path={'/news/:id'} component={NewsViewer} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default translate('general')(News)
