import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'

import './styles/News.scss'

import Header from './components/NewsHeader'
import NewsList from './components/NewsList'
import NewsViewer from './components/NewsViewer'
import NewsEditor from './components/NewsEditor'

class News extends Component {
    componentDidMount() {
        const {t} = this.props
        document.title = `${t('news')} | BnSTree`
    }

    //<Route exact path={'/news/:identifier'} component={NewsArticle} />

    render() {
        return (
            <div className="character">
                <div className="container">
                    <Header />
                    <div className="main-container">
                        <Switch>
                            <Route exact path={'/news'} component={NewsList} />
                            <Route exact path={'/news/new'} component={NewsEditor} />
                            <Route path={'/news/:id'} component={NewsViewer} />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default translate('general')(News)
